import { Request, Response, NextFunction } from 'express';
import { User } from '../db';
import { AuthRequest } from '../middleware/types';
import admin from 'firebase-admin';

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
    const { token } = req.body; // Firebase token sent from the frontend

    if (!token) {
      return res.status(400).json({ error: 'Firebase token is required' });
    }

    const firebaseUser = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({
      where: { email: firebaseUser.email, firebaseUID: firebaseUser.uid },
    });

    if (!user) {
      user = await User.create({
        email: firebaseUser.email,
        firebaseUID: firebaseUser.uid,
        // Add other user info as required
      });
    }

    res.json({ user });
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
    const authReq = req as AuthRequest;
    const user = await User.findOne({
      where: { firebaseUID: authReq.params.firebaseId },
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
