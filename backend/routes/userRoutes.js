// routes/userRoutes.js
import express from 'express';
import {
  getProfile,
  getDashboard,
  updateProfile,
} from '../controllers/userController.js';
import { auth } from '../middleware/authMiddleware.js'; // Corrected import path

const router = express.Router();

router.get('/profile', auth, getProfile);
router.get('/dashboard', auth, getDashboard);
router.put('/profile', auth, updateProfile); // New PUT route for updating profile

export default router;
