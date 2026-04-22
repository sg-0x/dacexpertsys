import { Router } from 'express';
import {
  createCaseController,
  getAllCasesController,
  approveCaseController,
} from '../controllers/cases.controller.js';

const router = Router();

router.get('/', getAllCasesController);
router.post('/', createCaseController);
router.put('/:id/approve', approveCaseController);

export default router;
