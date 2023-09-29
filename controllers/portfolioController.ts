import { Request, Response, NextFunction } from 'express';
import { UserPortfolios } from '../db';

export const createPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolio = await UserPortfolios.create(req.body);
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
    const portfolios = await UserPortfolios.findAll();
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
    const portfolio = await UserPortfolios.findByPk(req.params.portfolioId);
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
    const portfolio = await UserPortfolios.update(req.body, {
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
    const portfolio = await UserPortfolios.destroy({
      where: { id: req.params.portfolioId },
    });
    res.status(200).json(portfolio);
  } catch (error) {
    next(error);
  }
};

// Similar methods for getPortfolio, updatePortfolio, and deletePortfolio...
