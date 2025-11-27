const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validate = require('../middleware/validate');
const productValidation = require('../validations/productValidation');

router.post(
  '/', 
  validate(productValidation.createProductSchema), 
  productController.createProduct
);

router.get('/', productController.getProducts);

router.get('/:id', productController.getProductById);

router.put(
  '/:id', 
  validate(productValidation.updateProductSchema), 
  productController.updateProduct
);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
