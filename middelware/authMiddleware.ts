import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const {
  model: { User },
} = require('../db');
import { AuthRequest } from './types';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Assumes "Bearer TOKEN"
    if (!token) return res.status(403).json({ error: 'No token provided' });

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = user; // Attach the user to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
