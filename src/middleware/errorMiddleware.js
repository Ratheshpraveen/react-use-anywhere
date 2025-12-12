// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error for server-side tracking
  console.error(err);

  // Authentication-specific errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid or expired token'
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  // Generic server error
  res.status(err.status || 500).json({
    error: 'Server Error',
    message: err.message || 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
