import express from 'express';
import {
  registerExam,
  processPayment,
  getAdmitCard,
} from '../controllers/examController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registration', auth, registerExam);
router.post('/payment', auth, processPayment);
router.get('/admit-card', auth, getAdmitCard);

export default router;
