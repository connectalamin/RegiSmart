// controllers/examController.js
import examRegistrationModel from '../models/examRegistrationModel.js';

export const registerExam = async (req, res) => {
  const { semester, courses } = req.body;
  try {
    const registrationId = await examRegistrationModel.createRegistration({
      user_id: req.user.id,
      semester,
      courses
    });
    res.send({ message: 'Exam registration created, proceed to payment', registrationId });
  } catch (error) {
    res.status(400).send({ error: 'Registration failed' });
  }
};

export const processPayment = async (req, res) => {
  try {
    const registration = await examRegistrationModel.findPendingRegistration(req.user.id);
    if (!registration) {
      return res.status(404).send({ error: 'No pending registration found' });
    }
    const transactionId = Math.random().toString(36).substring(7);
    await examRegistrationModel.updatePaymentStatus(registration.id, transactionId);
    res.send({ message: 'Payment successful', transactionId });
  } catch (error) {
    res.status(500).send({ error: 'Payment failed' });
  }
};

export const getPaidRegistrations = async (req, res) => {
  try {
    const paidRegistrations = await examRegistrationModel.getPaidRegistrations();
    res.send(paidRegistrations);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch payments' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const registration = await examRegistrationModel.findRegistrationById(req.params.registrationId);
    if (!registration || registration.status !== 'paid') {
      return res.status(404).send({ error: 'Registration not found or not paid' });
    }
    await examRegistrationModel.verifyPayment(req.params.registrationId);
    res.send({ message: 'Payment verified, admit card available' });
  } catch (error) {
    res.status(500).send({ error: 'Verification failed' });
  }
};

export const getAdmitCard = async (req, res) => {
  try {
    const registration = await examRegistrationModel.findVerifiedRegistration(req.user.id);
    if (!registration) return res.status(403).send({ error: 'No verified registration found' });
    const admitCard = {
      name: registration.name,
      student_id: registration.student_id,
      session: registration.session,
      department: registration.department,
      batch: registration.batch,
      semester: registration.semester,
      courses: JSON.parse(registration.courses),
      transaction_id: registration.transaction_id
    };
    res.send(admitCard);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve admit card' });
  }
};