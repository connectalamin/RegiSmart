// middleware/auth.js
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const JWT_SECRET = 'your-secret-key'; // Replace with a secure key in production

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, JWT_SECRET);
    // @ts-ignore
    const user = await userModel.findUserById(decoded.id);
    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

export { auth };
