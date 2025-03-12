// backend/controllers/studentController.js
import Student from '../models/Student.js';

// Get student profile
export const getStudentProfile = async (req, res) => {
  const studentId = req.user.id; // Assuming you have middleware to verify token

  try {
    const [rows] = await Student.findById(studentId);
    if (rows.length === 0) {
      return res.status(404).send('Student not found');
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send('Error fetching profile');
  }
};

// Other student actions like course registration can go here