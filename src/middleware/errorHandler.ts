import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${err.message}`);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : message,
    message: statusCode === 500 ? 'An unexpected error occurred' : message
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response
) => {
  res.status(404).json({
    error: 'Not found',
    message: `The requested resource '${req.originalUrl}' was not found`
  });
};