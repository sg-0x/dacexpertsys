import bcrypt from 'bcrypt';
import {
  getAllUsersService,
  updateUserRoleService,
  resetUserPasswordService,
} from '../services/users.service.js';

const ALLOWED_ROLES = new Set(['student', 'warden', 'chief_warden', 'dsw', 'admin']);

function generateTempPassword() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `Temp@${random}`;
}

export async function getAllUsersController(req, res) {
  try {
    const excludeRole = req.query?.excludeRole ? String(req.query.excludeRole).toLowerCase() : null;
    const users = await getAllUsersService({ excludeRole });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function updateUserRoleController(req, res) {
  try {
    const userId = Number(req.params.id);
    const nextRole = String(req.body?.role || '').toLowerCase();

    if (!userId || !ALLOWED_ROLES.has(nextRole)) {
      return res.status(400).json({ error: 'A valid user id and role are required' });
    }

    const updatedUser = await updateUserRoleService(userId, nextRole);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ error: 'Failed to update role' });
  }
}

export async function resetUserPasswordController(req, res) {
  try {
    const userId = Number(req.params.id);
    if (!userId) {
      return res.status(400).json({ error: 'A valid user id is required' });
    }

    const tempPassword = generateTempPassword();
    const hash = await bcrypt.hash(tempPassword, 10);

    const updatedUser = await resetUserPasswordService(userId, hash);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Password reset successfully',
      tempPassword,
    });
  } catch (error) {
    console.error('Error resetting user password:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
}
