// routes/examRoutes.js
import express from 'express';
import { registerExam, processPayment, getPaidRegistrations, verifyPayment, getAdmitCard } from '../controllers/examController.js';
import { auth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registration', auth, registerExam);
router.post('/payment', auth, processPayment);
router.get('/payments', auth, admin, getPaidRegistrations);
router.post('/verify-payment/:registrationId', auth, admin, verifyPayment);
router.get('/admit-card', auth, getAdmitCard);

export default router;