import { Router } from 'express';
import {
	getAllUsersController,
	updateUserRoleController,
	resetUserPasswordController,
} from '../controllers/users.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllUsersController);
router.put('/:id/role', requireRoles('admin'), updateUserRoleController);
router.post('/:id/reset-password', requireRoles('admin'), resetUserPasswordController);

export default router;
