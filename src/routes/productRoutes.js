const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidationRules } = require('../middleware/productValidation');

// Create a new product
router.post('/', productValidationRules('create'), productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Update a product
router.put('/:id', productValidationRules('update'), productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
