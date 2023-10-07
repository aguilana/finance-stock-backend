import { Request } from 'express';
import { User, UserPortfolio } from '../db';

export interface AuthRequest extends Request {
  user: typeof User;
}

export interface StockType {
  symbol: string;
  name: string;
  latestPrice: number;
  marketCap: number;
  volume: number;
  open: number;
  close: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  changeOverTime: number;
  changeOverTimePercent: number;
  highestPrice: number;
  userPortfolio: typeof UserPortfolio;
}
