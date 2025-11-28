const productErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Handle specific product-related errors
  if (err.name === 'ProductNotFoundError') {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  // Generic server error
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
};

module.exports = productErrorHandler;
