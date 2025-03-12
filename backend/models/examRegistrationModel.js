// models/examRegistrationModel.js
import pool from '../config/db.js';

const examRegistrationModel = {
  async createRegistration({ user_id, semester, courses }) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO exam_registrations (user_id, semester, courses, status) VALUES (?, ?, ?, ?)',
        [user_id, semester, JSON.stringify(courses), 'pending payment']
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
        'SELECT id FROM exam_registrations WHERE user_id = ? AND status = ?',
        [user_id, 'pending payment']
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async updatePaymentStatus(registrationId, transactionId) {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'UPDATE exam_registrations SET status = ?, transaction_id = ? WHERE id = ?',
        ['paid', transactionId, registrationId]
      );
    } finally {
      connection.release();
    }
  },

  async getPaidRegistrations() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT er.*, u.student_id, u.name, u.session, u.department, u.batch FROM exam_registrations er JOIN users u ON er.user_id = u.id WHERE er.status = ?',
        ['paid']
      );
      return rows;
    } finally {
      connection.release();
    }
  },

  async verifyPayment(registrationId) {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'UPDATE exam_registrations SET status = ? WHERE id = ?',
        ['verified', registrationId]
      );
    } finally {
      connection.release();
    }
  },

  async findVerifiedRegistration(user_id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT er.semester, er.courses, er.transaction_id, u.student_id, u.name, u.session, u.department, u.batch FROM exam_registrations er JOIN users u ON er.user_id = u.id WHERE er.user_id = ? AND er.status = ?',
        [user_id, 'verified']
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async findRegistrationById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT status FROM exam_registrations WHERE id = ?', [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  }
};

export default examRegistrationModel;