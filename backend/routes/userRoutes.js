// routes/userRoutes.js
import express from 'express';
import { getProfile, getDashboard } from '../controllers/userController.js';
import { auth } from '../middleware/authMiddleware.js'; // Corrected import path

const router = express.Router();

router.get('/profile', auth, getProfile);
router.get('/dashboard', auth, getDashboard);

export default router;
