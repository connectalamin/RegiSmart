import PDFDocument from 'pdfkit';
import examRegistrationModel from '../models/examRegistrationModel.js';
import userModel from '../models/userModel.js';

export const registerExam = async (req, res) => {
  const { semester } = req.body;
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) return res.status(404).send({ error: 'User not found' });

    const sessionYear = parseInt(user.session.split('-')[0]); // e.g., "2020-2021" -> 2020
    let payment_amount;
    if (semester % 2 !== 0) {
      // Odd semester
      payment_amount = sessionYear <= 2020 ? 5000 : 6000;
    } else {
      // Even semester
      payment_amount = 600;
    }

    const registrationId = await examRegistrationModel.createRegistration({
      user_id: req.user.id,
      semester,
      payment_amount,
    });
    res.send({
      message: 'Exam registration created, proceed to payment',
      registrationId,
      payment_amount,
    });
  } catch (error) {
    res.status(400).send({ error: 'Registration failed' });
  }
};

export const processPayment = async (req, res) => {
  try {
    const registration = await examRegistrationModel.findPendingRegistration(
      req.user.id
    );
    if (!registration) {
      return res.status(404).send({ error: 'No pending registration found' });
    }
    const transactionId = Math.random().toString(36).substring(7);
    await examRegistrationModel.updatePaymentStatus(
      registration.id,
      transactionId
    );
    res.send({ message: 'Payment successful', transactionId });
  } catch (error) {
    res.status(500).send({ error: 'Payment failed' });
  }
};

export const getAdmitCard = async (req, res) => {
  try {
    const registration = await examRegistrationModel.findPaidRegistration(
      req.user.id
    );
    if (!registration) {
      return res.status(403).send({ error: 'No paid registration found' });
    }
    const user = await userModel.findUserById(req.user.id);

    const doc = new PDFDocument();
    res.setHeader('Content-disposition', 'attachment; filename=admit-card.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Admit Card', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Student ID: ${user.student_id || 'N/A'}`);
    doc.text(`Session: ${user.session || 'N/A'}`);
    doc.text(`Department: ${user.department || 'N/A'}`);
    doc.text(`Batch: ${user.batch || 'N/A'}`);
    doc.text(`Semester: ${registration.semester}`);
    doc.text(`Payment Amount: ${registration.payment_amount} TK`);
    doc.text(`Transaction ID: ${registration.transaction_id}`);
    doc.end();
  } catch (error) {
    res.status(500).send({ error: 'Failed to generate admit card' });
  }
};
