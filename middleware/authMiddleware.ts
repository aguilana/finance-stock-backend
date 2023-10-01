import { Request, Response, NextFunction, RequestHandler } from 'express';
const jwt = require('jsonwebtoken');
import { User } from '../db';
import { AuthRequest } from './types';

const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest; // Cast req to AuthRequest

    const token = req.headers.authorization?.split(' ')[1]; // Assumes "Bearer TOKEN"
    if (!token) return res.status(403).json({ error: 'No token provided' });

    const decoded: any = jwt.verify(
      token,
      process.env.JWT || 'your-secret-key'
    );

    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    authReq.user = user; // Attach the user to the authReq object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
// const authenticate = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1]; // Assumes "Bearer TOKEN"
//     if (!token) return res.status(403).json({ error: 'No token provided' });

//     const decoded: any = jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'your-secret-key'
//     );

//     const user = await User.findByPk(decoded.userId);
//     if (!user) return res.status(401).json({ error: 'Unauthorized' });

//     req.user = user; // Attach the user to the request object
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };
export default authenticate;
