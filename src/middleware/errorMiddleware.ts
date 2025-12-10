import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err.stack);

  // JWT-specific error handling
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Your authentication token has expired. Please log in again.'
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'The authentication token is invalid.'
    });
  }

  // Generic server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
};
