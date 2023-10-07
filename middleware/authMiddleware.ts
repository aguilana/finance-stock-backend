import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  HistoricalPrice,
  Stock,
  Transaction,
  User,
  UserPortfolio,
} from '../db';
import { AuthRequest } from './types';
import admin from '../services/firebaseAdmin';

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest; // Cast req to AuthRequest
    const authorizationHeader = authReq.headers.authorization || '';
    console.log('Received Authorization Header:', authorizationHeader);
    const token = authorizationHeader.split('Bearer ')[1].trim();

    console.log('TOKEN AFTER AUTHORIZATION??!\n', token);

    if (!token) {
      return res
        .status(401)
        .send({ message: 'Authentication failed: No token provided.' });
    }

    console.log('TOKEN PASSED IN THE AUTHENTICATE MIDDLEWARE\n', { token });

    try {
      const decodedToken = await admin.auth().verifyIdToken(token.toString());

      // find firebase user with decoded token
      const firebaseUser = await admin.auth().getUser(decodedToken.uid);
      console.log('firebaseUser', firebaseUser);
      console.log('post decoded token --->', decodedToken);

      const loggedInUser = await User.findOne({
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
      console.log({ loggedInUser });

      if (!loggedInUser) {
        return res
          .status(401)
          .send({ message: 'Authentication failed: User not found.' });
      }
      authReq.user = loggedInUser; // Attach the decoded token to the request
      console.log('authenticate middleware success', loggedInUser);
    } catch (error) {
      console.error('Error verifying token:', error);
      return res
        .status(401)
        .send({ message: 'Token verification failed.', error });
    }

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

  const { id } = authReq.params;
  const loggedInUserId = authReq.user.firebaseUID;

  if (loggedInUserId !== String(id)) {
    return res.status(403).send({ message: 'Unauthorized: Access denied.' });
  }

  next();
};
