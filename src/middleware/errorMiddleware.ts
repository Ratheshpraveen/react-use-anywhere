import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err.stack);

  // Handle specific authentication errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      message: 'Invalid token' 
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: err.message 
    });
  }

  // Generic server error
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};

export default errorMiddleware;
