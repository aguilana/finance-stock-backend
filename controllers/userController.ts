import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middelware/authMiddleware';
import { User } from '../db';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.params.userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// export const getUser = [
//   authenticate,
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = await User.findByPk(req.params.userId);
//       res.status(200).json({ user });
//     } catch (error) {
//       next(error);
//     }
//   },
// ];
