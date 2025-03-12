// backend/routes/studentRoutes.js
import express from 'express';
import {getStudentProfile} from '../controllers/studentController.js';
// Assuming you have authentication middleware

const router = express.Router();

// Student profile route
router.get('/profile', getStudentProfile);

export default router;