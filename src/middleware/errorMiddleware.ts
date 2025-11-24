import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err.stack);

  // Handle specific types of errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      message: 'Invalid or expired token' 
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: (err as any).errors 
    });
  }

  // Generic server error
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
};
