// models/examRegistrationModel.js
import pool from '../config/db.js';

const examRegistrationModel = {
  async createRegistration({ user_id, semester, payment_amount }) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO exam_registrations (user_id, semester, payment_amount) VALUES (?, ?, ?)',
        [user_id, semester, payment_amount]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async findPendingRegistration(user_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM exam_registrations WHERE user_id = ? AND transaction_id IS NULL ORDER BY created_at DESC LIMIT 1',
        [user_id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

async findPaidRegistration(user_id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT id, user_id, semester, payment_amount, transaction_id, courses FROM exam_registrations WHERE user_id = ? AND transaction_id IS NOT NULL ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
},

  async findPaidRegistrationBySemester(user_id, semester) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM exam_registrations WHERE user_id = ? AND semester = ? AND transaction_id IS NOT NULL ORDER BY created_at DESC LIMIT 1',
        [user_id, semester]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async updatePaymentStatus(registration_id, transaction_id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'UPDATE exam_registrations SET transaction_id = ? WHERE id = ?',
        [transaction_id, registration_id]
      );
    } finally {
      connection.release();
    }
  },
};

export default examRegistrationModel;
