// controllers/stockController.ts
import { NextFunction, Request, Response } from 'express';
import * as polygonService from '../services/polygonService';
import { getNewsForStock } from '../services/newsService';

export const createStock = async (req: Request, res: Response) => {
  // Your logic for creating a stock
};

export const getStocks = async (req: Request, res: Response) => {
  // Your logic for getting all stocks
  res.status(200).json({
    title: 'get all stocks route',
    status: 'success',
  });
};

export const getStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const symbol = req.params.symbol;
    const data = await polygonService.getStockData(symbol);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Your logic for updating a stock by ID
};

export const deleteStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Your logic for deleting a stock by ID
};

export const getNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticker = req.params.ticker;
    const news = await getNewsForStock(ticker);
    res.status(200).json({ news });
  } catch (error) {
    next(error);
  }
};
