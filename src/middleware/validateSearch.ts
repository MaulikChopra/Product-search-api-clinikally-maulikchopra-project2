import { Request, Response, NextFunction } from 'express';

export const validateSearchParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract query parameters
  const { q } = req.query;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = parseInt(req.query.skip as string) || 0;

  // Validate query string
  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      error: 'Missing query parameter: q',
      message: 'Search query (q) is required'
    });
  }

  if (q.length < 2) {
    return res.status(400).json({
      error: 'Invalid query length',
      message: 'Search query must be at least 2 characters long'
    });
  }

  // Validate limit and skip
  if (isNaN(limit) || limit < 1) {
    return res.status(400).json({
      error: 'Invalid limit parameter',
      message: 'Limit must be a positive number'
    });
  }

  if (isNaN(skip) || skip < 0) {
    return res.status(400).json({
      error: 'Invalid skip parameter',
      message: 'Skip must be a non-negative number'
    });
  }

  // Store validated parameters in request object for controller use
  req.query = {
    ...req.query,
    q,
    limit: limit.toString(),
    skip: skip.toString()
  };

  next();
};