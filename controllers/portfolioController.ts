import { Request, Response, NextFunction } from 'express';
const {
  models: { Portfolio },
} = require('../db'); // adjust the path as needed

export const createPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolio = await Portfolio.create(req.body);
    res.status(201).json(portfolio);
  } catch (error) {
    next(error);
  }
};

export const getPortfolios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Logic to get all portfolios
  try {
    const portfolios = await Portfolio.findAll();
    res.status(200).json(portfolios);
  } catch (error) {
    next(error);
  }
};

export const getPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.portfolioId);
    res.status(200).json(portfolio);
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolio = await Portfolio.update(req.body, {
      where: { id: req.params.portfolioId },
    });
    res.status(200).json(portfolio);
  } catch (error) {
    next(error);
  }
};

export const deletePortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolio = await Portfolio.destroy({
      where: { id: req.params.portfolioId },
    });
    res.status(200).json(portfolio);
  } catch (error) {
    next(error);
  }
};

// Similar methods for getPortfolio, updatePortfolio, and deletePortfolio...
