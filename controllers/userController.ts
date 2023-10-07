import { Request, Response, NextFunction } from 'express';
import { User } from '../db';
import { AuthRequest } from '../middleware/types';

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;
    const user = await User.findOne({
      where: { firebaseUID: authReq.params.id },
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
