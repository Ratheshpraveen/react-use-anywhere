const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to a file
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Write errors to console
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class ErrorHandler {
  // Authentication error handler
  static handleAuthError(error, req, res, next) {
    logger.error(`Authentication Error: ${error.message}`, {
      error: error,
      user: req.user ? req.user.email : 'Unknown',
      path: req.path
    });

    switch (error.name) {
      case 'UnauthorizedError':
        return res.status(401).json({ 
          message: 'Unauthorized access', 
          error: 'Invalid or expired token' 
        });
      
      case 'ValidationError':
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: error.details 
        });
      
      case 'DuplicateKeyError':
        return res.status(409).json({ 
          message: 'User already exists', 
          error: 'Duplicate key violation' 
        });
      
      default:
        return res.status(500).json({ 
          message: 'Authentication server error', 
          error: error.message 
        });
    }
  }

  // General error handler middleware
  static globalErrorHandler(error, req, res, next) {
    logger.error(`Unhandled Error: ${error.message}`, {
      error: error,
      stack: error.stack,
      path: req.path
    });

    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message
    });
  }

  // Log authentication events
  static logAuthEvent(eventType, user, details = {}) {
    logger.info(`Auth Event: ${eventType}`, {
      user: user ? user.email : 'Unknown',
      ...details
    });
  }
}

module.exports = ErrorHandler;
