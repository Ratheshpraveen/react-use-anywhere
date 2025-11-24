const { body } = require('express-validator');

exports.productValidationRules = (method) => {
  switch (method) {
    case 'create':
      return [
        body('category_id').notEmpty().withMessage('Category ID is required').isInt(),
        body('name').notEmpty().withMessage('Product name is required').isLength({ max: 255 }),
        body('sku').optional().isLength({ max: 100 }),
        body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }),
        body('stock_quantity').optional().isInt({ min: 0 })
      ];
    case 'update':
      return [
        body('category_id').optional().isInt(),
        body('name').optional().isLength({ max: 255 }),
        body('sku').optional().isLength({ max: 100 }),
        body('price').optional().isFloat({ min: 0 }),
        body('stock_quantity').optional().isInt({ min: 0 })
      ];
    default:
      return [];
  }
};
