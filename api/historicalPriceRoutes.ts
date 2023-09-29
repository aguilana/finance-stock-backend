import express from 'express';
import * as historicalPriceController from '../controllers/historicalPriceController'; // adjust the path as needed

const router = express.Router();

router.post('/', historicalPriceController.createHistoricalPrice); // Create a new historical price record
router.get('/', historicalPriceController.getHistoricalPrices); // Retrieve all historical price records
router.get('/:recordId', historicalPriceController.getHistoricalPrice); // Retrieve a single historical price record by ID
router.put('/:recordId', historicalPriceController.updateHistoricalPrice); // Update a historical price record by ID
router.delete('/:recordId', historicalPriceController.deleteHistoricalPrice); // Delete a historical price record by ID

export default router;
