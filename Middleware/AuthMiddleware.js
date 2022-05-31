import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../Models/UserModel.js';

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } else {
      res.status(401).json({ message: 'Not Authorized, token failed' });
    }
    if (!token) {
      res.status(401).json({ message: 'Not Authorized, token not found' });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

const admin = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(401).json({ message: 'Not authorization as an Admin' });
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

export { protect, admin };
