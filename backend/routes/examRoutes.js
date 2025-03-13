// routes/examRoutes.js
import express from 'express';
import {
  registerExam,
  processPayment,
  getAdmitCard,
  deleteAdmitCard,
} from '../controllers/examController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registration', auth, registerExam);
router.post('/payment', auth, processPayment);
router.get('/admit-card', auth, getAdmitCard);
router.delete('/admit-card/:id', auth, deleteAdmitCard); // Ensure this route is defined

export default router;
