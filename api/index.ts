import express from 'express';
import userRoutes from './userRoutes';
import stockRoutes from './stockRoutes';
import transactionRoutes from './transactionRoutes';
import historicalPriceRoutes from './historicalPriceRoutes';
import portfolioRoutes from './portfolioRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/stocks', stockRoutes);
router.use('/transactions', transactionRoutes);
router.use('/historicalPrices', historicalPriceRoutes);
router.use('/portfolios', portfolioRoutes);

module.exports = router;
