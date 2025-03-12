import express from 'express';
import db from './config/db.js'; // Import the database pool
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import examRoutes from './routes/examRoutes.js';
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exam', examRoutes);
// Test database connection
async function checkDatabaseConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('Database connected successfully! Result:', rows[0].solution);
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
