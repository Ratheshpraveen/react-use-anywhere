const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidationRules } = require('../validations/productValidation');
const { authenticate } = require('../middleware/authMiddleware');

// Product routes with authentication and validation
router.post('/', 
  authenticate, 
  productValidationRules('create'), 
  productController.createProduct
);

router.get('/', 
  authenticate, 
  productController.getAllProducts
);

router.get('/:id', 
  authenticate, 
  productController.getProductById
);

router.put('/:id', 
  authenticate, 
  productValidationRules('update'), 
  productController.updateProduct
);

router.delete('/:id', 
  authenticate, 
  productController.deleteProduct
);

module.exports = router;
