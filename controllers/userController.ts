import { Request, Response, NextFunction } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/authMiddleware');

const {
  model: { User },
} = require('../db');

exports.signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if email and password are provided
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ error: 'Credential error: Invalid email or password' });
    }

    // Check if the provided password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: 'Credential error: Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: '1d', // Token expires in 1 day
      }
    );

    // Send token to the client
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.getUser = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findByPk(req.params.userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },
];
