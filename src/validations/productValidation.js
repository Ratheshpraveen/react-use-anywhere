const { body } = require('express-validator');

exports.productValidationRules = (method) => {
  switch (method) {
    case 'create':
      return [
        body('name').notEmpty().withMessage('Product name is required'),
        body('category_id').isInt().withMessage('Valid category ID is required'),
        body('sku').optional().isString().withMessage('SKU must be a string'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
      ];
    case 'update':
      return [
        body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
        body('category_id').optional().isInt().withMessage('Valid category ID is required'),
        body('sku').optional().isString().withMessage('SKU must be a string'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
      ];
    default:
      return [];
  }
};
