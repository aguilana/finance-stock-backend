import express from 'express';
import * as portfolioController from '../controllers/portfolioController'; // adjust the path as needed

const router = express.Router();

router.post('/', portfolioController.createPortfolio); // Create a new portfolio
router.get('/', portfolioController.getPortfolios); // Retrieve all portfolios
router.get('/:portfolioId', portfolioController.getPortfolio); // Retrieve a single portfolio by ID
router.put('/:portfolioId', portfolioController.updatePortfolio); // Update a portfolio by ID
router.delete('/:portfolioId', portfolioController.deletePortfolio); // Delete a portfolio by ID

export default router;
