import { Request, Response, NextFunction } from 'express';
import { User } from '../db';
import { AuthRequest } from '../middleware/types';
import admin from '../services/firebaseAdmin';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Register the user using Firebase Auth
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    if (!firebaseUser) {
      return res
        .status(400)
        .json({ error: 'Failed to register with Firebase' });
    }

    // Add user to your database
    const user = await User.create({
      email: firebaseUser.email,
      firebaseUID: firebaseUser.uid,
      firstName,
      lastName,
      displayName: firebaseUser.displayName,
    });

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
      where: { firebaseUID: authReq.params.userId },
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
