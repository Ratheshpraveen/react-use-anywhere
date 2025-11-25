import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('Unhandled error:', err);

  // Handle specific JWT errors
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      message: 'Token has expired',
      error: 'TokenExpiredError'
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(403).json({
      message: 'Invalid token',
      error: 'JsonWebTokenError'
    });
  }

  // Generic server error
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
};
