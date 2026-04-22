import pool from '../config/db.js';

export async function getAllUsersService() {
  const result = await pool.query(`
    SELECT
      id,
      name,
      email,
      role,
      program,
      enrollment_no,
      year,
      hostel,
      room,
      total_points
    FROM users
  `);
  return result.rows;
}

export async function updateUserRoleService(userId, role) {
  const query = `
    UPDATE users
    SET role = $2
    WHERE id = $1
    RETURNING id, name, email, role, program, enrollment_no, year, hostel, room, total_points
  `;
  const result = await pool.query(query, [userId, role]);
  return result.rows[0] || null;
}

export async function resetUserPasswordService(userId, passwordHash) {
  const query = `
    UPDATE users
    SET password = $2
    WHERE id = $1
    RETURNING id, name, email, role
  `;
  const result = await pool.query(query, [userId, passwordHash]);
  return result.rows[0] || null;
}
