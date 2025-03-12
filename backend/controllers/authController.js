// backend/controllers/authController.js
const Student = require('../models/Student');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens

// Signup
exports.signup = async (req, res) => {
  const { name, email, password, course } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Student.create({ name, email, password: hashedPassword, course });
    res.status(201).send('Student registered successfully');
  } catch (err) {
    res.status(500).send('Error in registration');
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await Student.findByEmail(email);
    
    if (rows.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, 'secret_key'); // Use a proper secret
    res.json({ token });
  } catch (err) {
    res.status(500).send('Error in login');
  }
};
