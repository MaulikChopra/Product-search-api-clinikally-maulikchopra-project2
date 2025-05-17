import { Request, Response, NextFunction } from 'express';
import productService from '../services/productService';

export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const q = req.query.q as string;
    const limit = parseInt(req.query.limit as string);
    const skip = parseInt(req.query.skip as string);

    const result = productService.searchProducts(q, limit, skip);
    
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};