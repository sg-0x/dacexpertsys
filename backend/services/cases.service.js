import pool from '../config/db.js';

export async function getAllCasesService() {
  const result = await pool.query('SELECT * FROM cases');
  return result.rows;
}

export async function createCaseService(studentId, offenseType) {
  const query = `
    INSERT INTO cases (student_id, offense_type, status, severity)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [studentId, offenseType, 'pending', 'low'];
  const result = await pool.query(query, values);
  return result.rows[0];
}
