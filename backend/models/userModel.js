// models/userModel.js
import pool from '../config/db.js';

const userModel = {
  async createUser({ email, password, name, student_id, session, department, batch, hall_name, mobile_number, role, verified = false }) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, name, student_id, session, department, batch, hall_name, mobile_number, role, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, password, name, student_id || null, session || null, department || null, batch || null, hall_name || null, mobile_number || null, role, verified]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async findUserByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async findUserById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async getUnverifiedUsers() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, student_id, name, session, department, batch FROM users WHERE role = ? AND verified = ?',
        ['user', 0]
      );
      return rows;
    } finally {
      connection.release();
    }
  },

  async verifyUser(id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute('UPDATE users SET verified = ? WHERE id = ?', [true, id]);
    } finally {
      connection.release();
    }
  }
};

export default userModel;