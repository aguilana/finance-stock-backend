// controllers/stockController.ts
import { NextFunction, Request, Response } from 'express';
import * as polygonService from '../services/polygonService';
import { getNewsForStock } from '../services/newsService';
import { Stock, User, UserPortfolio, HistoricalPrice } from '../db';
import CustomError from '../utils/customError';
import { AuthRequest, StockType } from '../middleware/types';

// export const createStock = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const uid = req.headers.uid as string;
//     const { symbol, name } = req.body;

//     let stock = await Stock.findOne({ where: { symbol } });
//     if (!stock) {
//       stock = await Stock.create({ symbol, name });
//     }

//     const user = await User.findOne({ where: { id: uid } });
//     if (!user) {
//       throw new CustomError('User not found', 404);
//     }

//     await user.addStock(stock);
//     res
//       .status(201)
//       .json({ message: `Stock (${symbol}) added to user profile` });
//   } catch (error) {
//     next(error);
//   }
// };

// export const listStocks = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const allStocks = await Stock.findAll();
//   console.log(allStocks);
//   res.status(200).json(allStocks);
// };

export const listStocks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stocks = await Stock.findAll({
    include: {
      model: HistoricalPrice,
      limit: 1,
      order: [['date', 'DESC']],
    },
  });
  console.log('first stock', stocks[0]);
  console.log('first stocks historical price', stocks[0].historicalPrices[0]);
  const latestPrices = stocks.map((stock: typeof Stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    latestPrice: stock.historicalPrices.length
      ? stock.historicalPrices[0].latestPrice
      : 0,
  }));

  res.status(200).json(latestPrices);
};

export const getStocks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;

    const user = authReq.user;
    if (user) {
      console.log('----------------------------------------------');
      console.log('authReq.user -------------->', user);
      console.log('----------------------------------------------');

      const augmentedStocks: StockType[] = [];

      // Use Promise.all to fetch data concurrently for all stocks
      await Promise.all(
        user.clientPortfolio.map(async (stock: StockType) => {
          // Fetch the stock data for the current stock
          const stockData = await polygonService.getStockData(stock.symbol);

          // Add the latest price to the stock object (assuming the price field is named 'price' in the stockData)
          stock.latestPrice = stockData.price; // Adjust the field name if different in the response

          // Push the augmented stock object to the new array
          console.log('----------------------------------------------');
          console.log('stockData', stockData);
          console.log('----------------------------------------------');

          augmentedStocks.push(stock);
        })
      );

      // Send the augmented stocks as the response
      console.log('----------------------------------------------');
      console.log('augmentedStocks', augmentedStocks);
      console.log('----------------------------------------------');

      res.status(200).json(augmentedStocks); // Assuming user.stocks gets all stocks associated with the user
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
  const { stockSymbol } = req.params;
  // Validate the incoming data
  if (
    !req.body ||
    !req.body.name ||
    !req.body.latestPrice ||
    !req.body.symbol ||
    !req.body.volume ||
    !req.body.open
  ) {
    return res.status(400).send({ message: 'Invalid stock data provided.' });
  }
  try {
    // Find the stock by its symbol and update it
    const stock = await Stock.findOne({ where: { symbol: stockSymbol } });

    console.log('stock', stock);
    console.log({ reqBody: req.body });

    if (!stock) {
      return res.status(404).send({ message: 'Stock not found.' });
    }

    await HistoricalPrice.create({
      stockId: stock?.id,
      date: new Date(),
      latestPrice: req.body.latestPrice,
      volume: req.body.volume,
      open: req.body.open,
      // close: stock?.close,
      // high: stock?.high,
      // low: stock?.low,
      // change: stock?.change,
      // changePercent: stock?.changePercent,
      // changeOverTime: stock?.changeOverTime,
      // changeOverTimePercent: stock?.changeOverTimePercent,
      // highestPrice: stock?.highestPrice,
    });

    res.send({ message: 'Stock updated successfully.', stock });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).send({ message: 'Internal server error.' });
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
