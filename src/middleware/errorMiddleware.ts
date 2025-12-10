import { Request, Response, NextFunction } from 'express';

// Custom error class for authentication errors
class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
  }
}

// Error handling middleware
const errorMiddleware = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  // Handle specific types of errors
  if (err instanceof AuthenticationError) {
    return res.status(err.statusCode).json({
      error: 'Authentication Error',
      message: err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token Error',
      message: 'Invalid authentication token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Authentication token has expired'
    });
  }

  // Generic server error
  res.status(500).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};

export { 
  errorMiddleware, 
  AuthenticationError 
};
