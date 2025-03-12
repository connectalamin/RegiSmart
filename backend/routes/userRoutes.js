// routes/userRoutes.js
import express from 'express';
import { getProfile, getDashboard, verifyUser } from '../controllers/userController.js';
import { auth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', auth, getProfile);
router.get('/dashboard', auth, admin, getDashboard);
router.post('/verify/:userId', auth, admin, verifyUser);

export default router;