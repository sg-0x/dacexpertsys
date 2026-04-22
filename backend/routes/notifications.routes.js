import { Router } from 'express';
import {
  createNotificationController,
  getNotificationsController,
  markNotificationReadController,
} from '../controllers/notifications.controller.js';

const router = Router();

router.post('/create', createNotificationController);
router.get('/', getNotificationsController);
router.put('/:id/read', markNotificationReadController);

export default router;
