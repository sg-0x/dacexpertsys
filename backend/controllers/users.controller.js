import { getAllUsersService } from '../services/users.service.js';

export async function getAllUsersController(req, res) {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
