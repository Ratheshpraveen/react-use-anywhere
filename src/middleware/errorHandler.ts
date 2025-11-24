import { Request, Response, NextFunction } from 'express';

class ErrorHandler {
  // Global error handling middleware
  static handleError(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);

    // Authentication-specific error handling
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid or expired authentication token' 
      });
    }

    if (err.name === 'ForbiddenError') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You do not have permission to access this resource' 
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    });
  }

  // Catch-all for unhandled promise rejections
  static handleUnhandledRejections() {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Optionally exit the process in production
      // process.exit(1);
    });
  }

  // Catch-all for uncaught exceptions
  static handleUncaughtExceptions() {
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Optionally exit the process in production
      // process.exit(1);
    });
  }
}

export default ErrorHandler;
