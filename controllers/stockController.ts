// controllers/stockController.ts
import { NextFunction, Request, Response } from 'express';
import * as polygonService from '../services/polygonService';
import { getNewsForStock } from '../services/newsService';
import { Stock, User, UserPortfolio } from '../db';
import CustomError from '../utils/customError';

export const createStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.headers.uid as string;
    const { symbol, name } = req.body;

    let stock = await Stock.findOne({ where: { symbol } });
    if (!stock) {
      stock = await Stock.create({ symbol, name });
    }

    const user = await User.findOne({ where: { id: uid } });
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    await user.addStock(stock);
    res
      .status(201)
      .json({ message: `Stock (${symbol}) added to user profile` });
  } catch (error) {
    next(error);
  }
};

export const getStocks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.headers.uid as string;
    const user = await User.findOne({ where: { uid }, include: [Stock] });
    if (user) {
      res.status(200).json(user.stocks); // Assuming user.stocks gets all stocks associated with the user
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    next(error);
  }
};

export const getStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.headers.uid as string;
    const { symbol } = req.params;

    const user = await User.findOne({
      where: { uid },
      include: [{ model: Stock, where: { symbol } }],
    });

    if (user && user.stocks && user.stocks.length) {
      const stockData = await polygonService.getStockData(symbol); // Fetch latest stock data from Polygon API
      res.status(200).json({ ...user.stocks[0], ...stockData });
    } else {
      throw new CustomError('Stock not found for user.', 404);
    }
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.headers.uid as string;
    const { stockId } = req.params;
    const { quantity } = req.body;

    // First, find the user and the specific stock in their portfolio
    const userStock = await UserPortfolio.findOne({
      where: {
        userId: uid,
        stockId: stockId,
      },
    });

    // If the stock exists for the user, update the quantity
    if (userStock) {
      userStock.quantity = quantity;
      await userStock.save();
      res.status(200).json(userStock);
    } else {
      throw new Error('Stock not found for user.');
    }
  } catch (error) {
    next(error);
  }
};

export const deleteStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uid = req.headers.uid as string;
    const { stockId } = req.params;

    const userStock = await UserPortfolio.findOne({
      where: {
        userId: uid,
        stockId: stockId,
      },
    });

    if (userStock) {
      await userStock.destroy();
      res.status(200).json({ message: 'Stock removed from user portfolio.' });
    } else {
      throw new Error('Stock not found for user.');
    }
  } catch (error) {
    next(error);
  }
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
