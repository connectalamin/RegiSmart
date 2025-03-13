// controllers/examController.js
import PDFDocument from 'pdfkit';
import examRegistrationModel from '../models/examRegistrationModel.js';
import userModel from '../models/userModel.js';

export const registerExam = async (req, res) => {
  const { semester, courses } = req.body;
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) return res.status(404).send({ error: 'User not found' });

    const sessionYear = parseInt(user.session.split('-')[0]);
    let payment_amount;
    if (semester % 2 !== 0) {
      payment_amount = sessionYear <= 2020 ? 5000 : 6000;
    } else {
      payment_amount = 600;
    }

    const registrationId = await examRegistrationModel.createRegistration({
      user_id: req.user.id,
      semester,
      payment_amount,
      courses,
    });
    res.send({
      message: 'Exam registration created, proceed to payment',
      registrationId,
      payment_amount,
    });
  } catch (error) {
    res.status(400).send({ error: 'Registration failed: ' + error.message });
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
    console.log('Request received for admit card:', req.query);
    const semester = req.query.semester;
    const userId = req.user.id;
    console.log('User ID from middleware:', userId);

    if (!userId) {
      return res.status(401).send({ error: 'User not authenticated' });
    }

    let registrations;
    if (semester) {
      registrations = await examRegistrationModel
        .findPaidRegistrationBySemester(userId, semester)
        .catch((err) => {
          console.error('Error fetching registration by semester:', err);
          throw new Error(
            'Failed to fetch registration data for specified semester'
          );
        });
      registrations = registrations ? [registrations] : [];
    } else {
      registrations = await examRegistrationModel
        .findAllPaidRegistrations(userId)
        .catch((err) => {
          console.error('Error fetching all registrations:', err);
          throw new Error('Failed to fetch all registration data');
        });
    }

    if (!registrations || registrations.length === 0) {
      return res.status(403).send({ error: 'No paid registrations found' });
    }

    const user = await userModel.findUserById(userId).catch((err) => {
      console.error('Error fetching user:', err);
      throw new Error('Failed to fetch user data');
    });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const admitCardsData = registrations.map((registration) => ({
      id: registration.id,
      semester: registration.semester,
      session: user.session || 'N/A',
      name: user.name,
      student_id: user.student_id || 'N/A',
      batch: user.batch || 'N/A',
      department: user.department || 'N/A',
      hall_name: user.hall_name || 'N/A',
      transaction_id: registration.transaction_id || 'N/A',
      courses: registration.courses || '[]',
    }));

    if (req.query.format === 'json') {
      console.log('Returning JSON:', admitCardsData);
      return res.json(admitCardsData);
    }

    const doc = new PDFDocument();
    res.setHeader('Content-disposition', 'attachment; filename=admit-card.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    const data = admitCardsData[0];
    doc.fontSize(20).text('Admit Card', { align: 'center' });
    doc.moveDown();
    doc
      .fontSize(14)
      .text(
        `Exam: ${data.semester} Semester Final Examination of ${data.session}`
      );
    doc.text(`Name: ${data.name}`);
    doc.text(`Student ID: ${data.student_id}`);
    doc.text(`Batch: ${data.batch}`);
    doc.text(`Department: ${data.department}`);
    doc.text(`Hall: ${data.hall_name}`);
    if (data.courses && data.courses !== '[]') {
      const coursesArray = JSON.parse(data.courses);
      doc.text(
        `Courses: ${coursesArray
          .map((c) => `${c.code} - ${c.name}`)
          .join(', ')}`
      );
    } else {
      doc.text('Courses: N/A');
    }
    doc.text(`Transaction ID: ${data.transaction_id}`);
    doc.end();
  } catch (error) {
    console.error('Admit card generation error:', error);
    res
      .status(500)
      .send({ error: 'Failed to generate admit card: ' + error.message });
  }
};

export const deleteAdmitCard = async (req, res) => {
  console.log('DELETE request received for admit card ID:', req.params.id); // Add logging
  try {
    const registrationId = req.params.id;
    const userId = req.user.id;
    console.log('User ID:', userId, 'Registration ID:', registrationId);

    const registration = await examRegistrationModel.findPaidRegistrationById(
      registrationId
    );
    console.log('Found registration:', registration);
    if (!registration) {
      return res.status(404).send({ error: 'Admit card not found' });
    }
    if (registration.user_id !== userId) {
      return res
        .status(403)
        .send({ error: 'Unauthorized to delete this admit card' });
    }

    const deleted = await examRegistrationModel.deleteAdmitCard(registrationId);
    console.log('Delete result:', deleted);
    if (deleted) {
      res.send({ message: 'Admit card deleted successfully' });
    } else {
      res.status(404).send({ error: 'Admit card not found' });
    }
  } catch (error) {
    console.error('Error in deleteAdmitCard:', error);
    res
      .status(500)
      .send({ error: 'Failed to delete admit card: ' + error.message });
  }
};
