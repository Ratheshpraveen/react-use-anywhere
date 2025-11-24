import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err.stack);

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized',
      error: err.message
    });
  }

  // Generic server error
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};
