import pool from '../config/db.js';

export async function getAllUsersService() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}
