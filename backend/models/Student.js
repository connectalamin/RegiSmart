// backend/models/Student.js
import pool from '../config/db.js';

// Student model to interact with the "students" table
const Student = {
  create: (data) => {
    return pool.execute(
      'INSERT INTO students (name, email, password, course) VALUES (?, ?, ?, ?)', 
      [data.name, data.email, data.password, data.course]
    );
  },
  findByEmail: (email) => {
    return pool.execute('SELECT * FROM students WHERE email = ?', [email]);
  },
  // Add other methods as needed (e.g., findById, update, etc.)
};

export default Student;