const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const stockRoutes = require('./stockRoutes');
const transactionRoutes = require('./transactionRoutes');
const historicalPriceRoutes = require('./historicalPriceRoutes');
const portfolioRoutes = require('./portfolioRoutes');

router.use('/users', userRoutes);
router.use('/stocks', stockRoutes);
router.use('/transactions', transactionRoutes);
router.use('/historicalPrices', historicalPriceRoutes);
router.use('/portfolios', portfolioRoutes);

module.exports = router;
