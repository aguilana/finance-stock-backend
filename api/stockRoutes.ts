import express from 'express';
import * as stockController from '../controllers/stockController'; // adjust the path as needed

const router = express.Router();

// Define your routes here
router.post('/', stockController.createStock); // Create a new stock
router.get('/', stockController.getStocks); // Retrieve all stocks
router.get('/:symbol', stockController.getStock); // Retrieve a single stock by ID
router.put('/:stockId', stockController.updateStock); // Update a stock by ID
router.delete('/:stockId', stockController.deleteStock); // Delete a stock by ID

export default router;
