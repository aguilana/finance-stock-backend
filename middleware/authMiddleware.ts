import { Request, Response, NextFunction, RequestHandler } from 'express';
import { User } from '../db';
import { AuthRequest } from './types';
import admin from 'firebase-admin';

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest; // Cast req to AuthRequest
    const authorizationHeader = authReq.headers.authorization || '';
    const token = authorizationHeader.split('Bearer ')[1];

    if (!token) {
      return res
        .status(401)
        .send({ message: 'Authentication failed: No token provided.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const loggedInUser = await User.findOne({
      where: { firebaseUID: decodedToken.uid },
    });

    if (!loggedInUser) {
      return res
        .status(401)
        .send({ message: 'Authentication failed: User not found.' });
    }
    authReq.user = loggedInUser; // Attach the decoded token to the request

    next();
  } catch (error) {
    res.status(401).send({ message: 'Authentication failed.' });
  }
};

export const checkUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    return res.status(401).send({ message: 'Unauthorized: User not found.' });
  }

  const { userId } = authReq.params;
  const loggedInUserId = authReq.user.firebaseUID;

  if (loggedInUserId !== parseInt(userId, 10)) {
    return res.status(403).send({ message: 'Unauthorized: Access denied.' });
  }

  next();
};
