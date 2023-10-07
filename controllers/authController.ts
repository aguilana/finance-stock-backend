import { Request, Response, NextFunction } from 'express';
import {
  HistoricalPrice,
  Stock,
  Transaction,
  User,
  UserPortfolio,
} from '../db';
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

    console.log('firebaseUser in backend authContoller', firebaseUser);

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

    res.status(201).json({
      email: user.email,
      displayName: user.displayName,
      ...(user.isAdmin && { isAdmin: true }),
    });
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
    // Firebase token sent from the frontend
    const authorizationHeader = req.headers.authorization || '';
    const token = authorizationHeader.split('Bearer ')[1];

    // console.log('req.body and token', {
    //   reqBody: req.body,
    //   authorizationHeader,
    //   token,
    // });

    if (!token) {
      return res.status(400).json({ error: 'Firebase token is required' });
    }

    const firebaseUser = await admin.auth().verifyIdToken(token);
    // console.log('firebaseUser', firebaseUser);

    if (!firebaseUser) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    const user = await User.findOne({
      where: { email: firebaseUser.email, firebaseUID: firebaseUser.uid },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // console.log('user', user);
    res.status(200).json({
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`,
      ...(user.isAdmin && { isAdmin: true }),
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuthState = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Firebase token sent from the frontend
    const authorizationHeader = req.headers.authorization || '';
    const token = authorizationHeader.split('Bearer ')[1];
    // console.log('token in chechAuthState', token);
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    // Verify the token (this depends on how you're managing tokens;
    // the below is an example for Firebase)
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('decodedToken', decodedToken);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // find firebase user with decoded token
    const firebaseUser = await admin.auth().getUser(decodedToken.uid);
    console.log('firebaseUser', firebaseUser);
    // Fetch the user details using the UID from the decoded token
    const user = await User.findOne({
      where: { firebaseUID: decodedToken.uid },
      include: [
        {
          model: Stock,
          as: 'clientPortfolio',
          through: { model: UserPortfolio },
        },
        // HistoricalPrice,
        Transaction,
      ],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // console.log('user', user);
    console.log(
      `${user.firstName} ${user.lastName} found with firebase id ${decodedToken.uid}`
    );
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
