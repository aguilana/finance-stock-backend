import express from 'express';
import * as transactionController from '../controllers/transactionController'; // adjust the path as needed

const router = express.Router();

router.post('/', transactionController.createTransaction); // Create a new transaction
router.get('/', transactionController.getTransactions); // Retrieve all transactions
router.get('/:transactionId', transactionController.getTransaction); // Retrieve a single transaction by ID
router.put('/:transactionId', transactionController.updateTransaction); // Update a transaction by ID
router.delete('/:transactionId', transactionController.deleteTransaction); // Delete a transaction by ID

export default router;
