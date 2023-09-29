import { Request } from 'express';
const {
  model: { User },
} = require('../db');

export interface AuthRequest extends Request {
  user: typeof User;
}
