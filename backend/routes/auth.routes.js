import { Router } from 'express';
import {
	loginController,
	changePasswordController,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', loginController);
router.post('/change-password', verifyToken, changePasswordController);

export default router;
