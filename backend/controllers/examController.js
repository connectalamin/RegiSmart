// Import models
import userModel from '../models/userModel.js';
import PDFDocument from 'pdfkit';
import examRegistrationModel from '../models/examRegistrationModel.js';


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
    console.log('Request received for admit card:', req.query);
    const semester = req.query.semester;
    const userId = req.user.id;
    console.log('User ID from middleware:', userId);

    if (!userId) {
      return res.status(401).send({ error: 'User not authenticated' });
    }

    // Fetch registration based on whether semester is provided
    let registration;
    if (semester) {
      registration = await examRegistrationModel
        .findPaidRegistrationBySemester(userId, semester)
        .catch((err) => {
          console.error('Error fetching registration by semester:', err);
          throw new Error(
            'Failed to fetch registration data for specified semester'
          );
        });
    } else {
      registration = await examRegistrationModel
        .findPaidRegistration(userId)
        .catch((err) => {
          console.error('Error fetching latest registration:', err);
          throw new Error('Failed to fetch latest registration data');
        });
    }

    if (!registration) {
      return res.status(403).send({ error: 'No paid registration found' });
    }

    const user = await userModel.findUserById(userId).catch((err) => {
      console.error('Error fetching user:', err);
      throw new Error('Failed to fetch user data');
    });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const admitCardData = {
      semester: registration.semester,
      session: user.session || 'N/A',
      name: user.name,
      student_id: user.student_id || 'N/A',
      batch: user.batch || 'N/A',
      department: user.department || 'N/A',
      hall_name: user.hall_name || 'N/A',
      transaction_id: registration.transaction_id || 'N/A',
      courses: registration.courses || [], // Include courses if available
    };

    if (req.query.format === 'json') {
      console.log('Returning JSON:', admitCardData);
      return res.json(admitCardData);
    }

    // Generate PDF (for non-JSON requests)
    const doc = new PDFDocument();
    res.setHeader('Content-disposition', 'attachment; filename=admit-card.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Admit Card', { align: 'center' });
    doc.moveDown();
    doc
      .fontSize(14)
      .text(
        `Exam: ${admitCardData.semester} Semester Final Examination of ${admitCardData.session}`
      );
    doc.text(`Name: ${admitCardData.name}`);
    doc.text(`Student ID: ${admitCardData.student_id}`);
    doc.text(`Batch: ${admitCardData.batch}`);
    doc.text(`Department: ${admitCardData.department}`);
    doc.text(`Hall: ${admitCardData.hall_name}`);
    if (admitCardData.courses.length) {
      doc.text(
        `Courses: ${admitCardData.courses
          .map((c) => `${c.code} - ${c.name}`)
          .join(', ')}`
      );
    }
    doc.text(`Transaction ID: ${admitCardData.transaction_id}`);
    doc.end();
  } catch (error) {
    console.error('Admit card generation error:', error);
    res
      .status(500)
      .send({ error: 'Failed to generate admit card: ' + error.message });
  }
};