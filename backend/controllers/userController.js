import userModel from '../models/userModel.js';
import examRegistrationModel from '../models/examRegistrationModel.js';

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    const userData = {
      email: user.email,
      name: user.name,
      student_id: user.student_id || null,
      session: user.session || null,
      department: user.department || null,
      batch: user.batch || null,
      hall_name: user.hall_name || null,
      mobile_number: user.mobile_number || null,
    };
    res.send(userData);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch profile' });
  }
};

export const getDashboard = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const user = await userModel.findUserById(req.user.id);
    console.log('Fetched user:', user);
    const registration = await examRegistrationModel.findPaidRegistration(
      req.user.id
    );
    console.log('Fetched registration:', registration);
    const dashboardData = {
      email: user.email,
      name: user.name,
      student_id: user.student_id || null,
      session: user.session || null,
      department: user.department || null,
      batch: user.batch || null,
      hall_name: user.hall_name || null,
      mobile_number: user.mobile_number || null,
      hasPaidRegistration: !!registration,
    };
    res.send(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send({ error: 'Failed to fetch dashboard data' });
  }
};
