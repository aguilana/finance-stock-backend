import { Request, Response, NextFunction } from 'express';
const {
  models: { Transaction },
} = require('../db');
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Logic to get all transactions
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findByPk(req.params.transactionId);
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.update(req.body, {
      where: { id: req.params.transactionId },
    });
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.destroy({
      where: { id: req.params.transactionId },
    });
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Similar methods for getTransaction, updateTransaction, and deleteTransaction...
