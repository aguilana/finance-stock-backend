import { Request } from 'express';
import { User } from '../db';

export interface AuthRequest extends Request {
  user: typeof User;
}
