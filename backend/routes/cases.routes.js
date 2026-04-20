import { Router } from 'express';
import {
  createCaseController,
  getAllCasesController,
} from '../controllers/cases.controller.js';

const router = Router();

router.get('/', getAllCasesController);
router.post('/', createCaseController);

export default router;
