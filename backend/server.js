// backend/server.js
import express from 'express';
import bodyParser from 'body-parser';
//import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

// Middleware
app.use(bodyParser.json()); // For parsing JSON bodies

// Routes
//app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});