import { Request, Response, NextFunction } from 'express';
const {
  models: { HistoricalPrice },
} = require('../db');

// Logic to create a new historical price record
export const createHistoricalPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const historicalPrice = await HistoricalPrice.create(req.body);
    res.status(201).json(historicalPrice);
  } catch (error) {
    next(error);
  }
};

export const getHistoricalPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Logic to get all historical prices
  try {
    const historicalPrices = await HistoricalPrice.findAll();
    res.status(200).json(historicalPrices);
  } catch (error) {
    next(error);
  }
};

export const getHistoricalPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const historicalPrice = await HistoricalPrice.findByPk(
      req.params.historicalPriceId
    );
    res.status(200).json(historicalPrice);
  } catch (error) {
    next(error);
  }
};

export const updateHistoricalPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const historicalPrice = await HistoricalPrice.update(req.body, {
      where: { id: req.params.historicalPriceId },
    });
    res.status(200).json(historicalPrice);
  } catch (error) {
    next(error);
  }
};

export const deleteHistoricalPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const historicalPrice = await HistoricalPrice.destroy({
      where: { id: req.params.historicalPriceId },
    });
    res.status(200).json(historicalPrice);
  } catch (error) {
    next(error);
  }
};
// Similar methods for getHistoricalPrice, updateHistoricalPrice, and deleteHistoricalPrice...
