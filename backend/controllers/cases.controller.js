import {
  createCaseService,
  getAllCasesService,
  approveCaseService,
} from '../services/cases.service.js';

export async function getAllCasesController(req, res) {
  try {
    const requesterRole = String(req.user?.role || '').toLowerCase();
    const requesterId = Number(req.user?.sub);
    const roleFilter = req.query?.role ? String(req.query.role).toLowerCase() : null;
    const statusFilter = req.query?.status ? String(req.query.status).toLowerCase() : null;

    if (roleFilter && requesterRole !== 'admin' && roleFilter !== requesterRole) {
      return res.status(403).json({ error: 'Forbidden role filter' });
    }

    const cases = await getAllCasesService({
      requesterRole,
      requesterId,
      role: roleFilter,
      status: statusFilter,
    });
    res.status(200).json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
}

export async function createCaseController(req, res) {
  try {
    const { student_id: studentId, offense_type: offenseType } = req.body;
    const requesterRole = String(req.user?.role || '').toLowerCase();
    const requesterId = Number(req.user?.sub);

    if (requesterRole !== 'warden') {
      return res.status(403).json({ error: 'Only warden can create cases' });
    }

    if (!studentId || !offenseType) {
      return res.status(400).json({ error: 'student_id and offense_type are required' });
    }

    const createdCase = await createCaseService(req.body, requesterId);
    return res.status(201).json(createdCase);
  } catch (error) {
    console.error('Error creating case:', error);
    const details = process.env.NODE_ENV === 'production' ? undefined : error?.message;
    return res.status(500).json({ error: 'Failed to create case', details });
  }
}

export async function approveCaseController(req, res) {
  try {
    const caseId = Number(req.params.id);
    if (!caseId) {
      return res.status(400).json({ error: 'A valid case id is required' });
    }

    const actor = {
      id: Number(req.user?.sub),
      role: String(req.user?.role || '').toLowerCase(),
    };
    const updatedCase = await approveCaseService(caseId, actor);
    return res.status(200).json({
      message: 'Case workflow updated successfully',
      case: updatedCase,
    });
  } catch (error) {
    if (error?.message === 'CASE_NOT_FOUND') {
      return res.status(404).json({ error: 'Case not found' });
    }
    if (error?.message === 'CASE_ALREADY_RESOLVED') {
      return res.status(400).json({ error: 'Case is already resolved' });
    }
    if (error?.message === 'NOT_ASSIGNED_ROLE' || error?.message === 'FORBIDDEN_ROLE') {
      return res.status(403).json({ error: 'Only the assigned role can approve this case' });
    }
    if (error?.message === 'INVALID_TRANSITION') {
      return res.status(400).json({ error: 'Invalid workflow transition' });
    }

    console.error('Error approving case:', error);
    return res.status(500).json({ error: 'Failed to approve case' });
  }
}
