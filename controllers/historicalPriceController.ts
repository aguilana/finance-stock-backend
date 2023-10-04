import { Request, Response, NextFunction } from 'express';
import { HistoricalPrice } from '../db';
import * as polygonService from '../services/polygonService';

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
    const { symbol } = req.params;

    // Check if the historical data for this stock and date range exists in your database
    let historicalData = await HistoricalPrice.findAll({
      where: {
        stockId: symbol,
        // Add date range if needed
      },
      order: [['date', 'ASC']],
    });

    // If data doesn't exist in the database, fetch from Polygon and save to the database
    if (!historicalData.length) {
      const polygonData = await polygonService.getHistoricalData(symbol);

      // Assuming polygonData is an array of historical data
      for (const data of polygonData) {
        await HistoricalPrice.create({
          stockId: symbol,
          date: data.date,
          open: data.open,
          close: data.close,
          high: data.high,
          low: data.low,
          volume: data.volume,
        });
      }

      historicalData = polygonData;
    }

    res.status(200).json(historicalData);
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
