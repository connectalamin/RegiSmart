// controllers/userController.js
import userModel from '../models/userModel.js';

export const getProfile = async (req, res) => {
  const userData = {
    email: req.user.email,
    name: req.user.name,
    student_id: req.user.student_id || null,
    session: req.user.session || null,
    department: req.user.department || null,
    batch: req.user.batch || null,
    hall_name: req.user.hall_name || null,
    mobile_number: req.user.mobile_number || null
  };
  res.send(userData);
};

export const getDashboard = async (req, res) => {
  try {
    const unverifiedUsers = await userModel.getUnverifiedUsers();
    res.send(unverifiedUsers);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch unverified users' });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.params.userId);
    if (!user || user.role !== 'user') {
      return res.status(404).send({ error: 'User not found' });
    }
    await userModel.verifyUser(req.params.userId);
    res.send({ message: 'User verified' });
  } catch (error) {
    res.status(500).send({ error: 'Verification failed' });
  }
};