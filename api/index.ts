import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './userRoutes';
import stockRoutes from './stockRoutes';
import transactionRoutes from './transactionRoutes';
import historicalPriceRoutes from './historicalPriceRoutes';
import portfolioRoutes from './portfolioRoutes';
import CustomError from '../utils/customError';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/stocks', stockRoutes);
router.use('/transactions', transactionRoutes);
router.use('/historicalPrices', historicalPriceRoutes);
router.use('/portfolios', portfolioRoutes);

router.use((req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError('Not Found', 404);
  next(error);
});
module.exports = router;
