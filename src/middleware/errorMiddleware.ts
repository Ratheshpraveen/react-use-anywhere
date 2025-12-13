import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
    new winston.transports.Console()
  ]
});

// Error handling middleware
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    method: req.method,
    path: req.path,
    body: req.body,
    stack: err.stack
  });

  // Authentication-specific error handling
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: 'Unauthorized'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      error: 'Unauthorized'
    });
  }

  // Generic server error
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  });
};
