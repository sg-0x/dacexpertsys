import pool from '../config/db.js';
import {
  createNotificationsForRoleService,
  createNotificationService,
} from './notifications.service.js';

function canActOnRole(role) {
  return ['chief_warden', 'dsw', 'admin'].includes(String(role || '').toLowerCase());
}

function getNextWorkflowState(role) {
  const normalizedRole = String(role || '').toLowerCase();
  if (normalizedRole === 'chief_warden') {
    return {
      status: 'pending_dsw',
      assignedToRole: 'dsw',
      notifyRole: 'dsw',
      notifyMessage: 'Case approved by Chief Warden. Ready for review.',
    };
  }

  if (normalizedRole === 'dsw') {
    return {
      status: 'pending_admin',
      assignedToRole: 'admin',
      notifyRole: 'admin',
      notifyMessage: 'Case forwarded by DSW. Final decision required.',
    };
  }

  if (normalizedRole === 'admin') {
    return {
      status: 'resolved',
      assignedToRole: null,
      notifyRole: null,
      notifyMessage: null,
    };
  }

  return null;
}

export async function getAllCasesService({ requesterRole, requesterId, role, status }) {
  const conditions = [];
  const values = [];

  if (requesterRole === 'warden') {
    values.push(requesterId);
    conditions.push(`created_by = $${values.length}`);
  } else if (requesterRole === 'chief_warden' || requesterRole === 'admin') {
    const targetRole = requesterRole === 'admin' ? (role || requesterRole) : requesterRole;
    if (targetRole) {
      values.push(targetRole);
      conditions.push(`assigned_to_role = $${values.length}`);
    }
  } else if (requesterRole === 'dsw') {
    // DSW needs pending queue plus downstream status visibility for dashboard stats.
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    } else {
      conditions.push(`status IN ('pending_dsw', 'pending_admin', 'resolved')`);
    }
  }

  if (status && requesterRole !== 'dsw') {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT *
    FROM cases
    ${whereClause}
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

export async function createCaseService(payload, requesterId) {
  const {
    student_id: studentId,
    offense_type: offenseType,
    description = null,
    location = null,
    incident_date: incidentDate = null,
    severity = 'low',
    penalty_points: penaltyPoints = 0,
  } = payload;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

  const query = `
    INSERT INTO cases (
      student_id,
      created_by,
      assigned_to_role,
      reported_by,
      offense_type,
      status,
      severity,
      description,
      location,
      incident_date,
      penalty_points
    )
    VALUES ($1, $2, $3, $2, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

    const values = [
      studentId,
      requesterId,
      'chief_warden',
      offenseType,
      'pending_chief',
      severity,
      description,
      location,
      incidentDate,
      penaltyPoints,
    ];
    const result = await client.query(query, values);
    const createdCase = result.rows[0];

    await createNotificationsForRoleService(
      {
        role: 'chief_warden',
        message: 'New case created by Warden. Click to review.',
        caseId: createdCase.id,
      },
      client,
    );

    await client.query('COMMIT');
    return createdCase;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function approveCaseService(caseId, actor) {
  if (!canActOnRole(actor?.role)) {
    throw new Error('FORBIDDEN_ROLE');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT * FROM cases WHERE id = $1 FOR UPDATE', [caseId]);
    const currentCase = existing.rows[0];
    if (!currentCase) {
      throw new Error('CASE_NOT_FOUND');
    }

    if (String(currentCase.status || '').toLowerCase() === 'resolved') {
      throw new Error('CASE_ALREADY_RESOLVED');
    }

    if (String(currentCase.assigned_to_role || '').toLowerCase() !== String(actor.role || '').toLowerCase()) {
      throw new Error('NOT_ASSIGNED_ROLE');
    }

    const nextState = getNextWorkflowState(actor.role);
    if (!nextState) {
      throw new Error('INVALID_TRANSITION');
    }

    const updated = await client.query(
      `
      UPDATE cases
      SET
        status = $2::case_status,
        assigned_to_role = $3::user_role,
        resolved_by = CASE WHEN $2::case_status = 'resolved'::case_status THEN $4 ELSE resolved_by END
      WHERE id = $1
      RETURNING *
      `,
      [caseId, nextState.status, nextState.assignedToRole, actor.id],
    );
    const updatedCase = updated.rows[0];

    if (nextState.notifyRole) {
      await createNotificationsForRoleService(
        {
          role: nextState.notifyRole,
          message: nextState.notifyMessage,
          caseId: updatedCase.id,
        },
        client,
      );
    }

    if (updatedCase.created_by) {
      const creatorMessage = `Case #${updatedCase.id} moved to ${nextState.status.replace('_', ' ')}.`;
      await createNotificationService(
        {
          userId: updatedCase.created_by,
          message: creatorMessage,
          caseId: updatedCase.id,
        },
        client,
      );
    }

    await client.query('COMMIT');
    return updatedCase;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
