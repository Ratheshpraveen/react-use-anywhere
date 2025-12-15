import { Request, Response, NextFunction } from 'express';

// Custom error classes
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication-specific errors
export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// Global error handling middleware
export const globalErrorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle unexpected errors
  console.error('UNHANDLED ERROR 💥', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

// Async error wrapper to avoid repetitive try-catch
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
