import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repositories/ProductRepository';
import { Database } from '../database/Database'; // Assuming you have a Database class

export function setupProductRoutes(router: Router, db: Database): void {
  const productRepository = new ProductRepository(db);
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  router.post('/products', (req, res) => productController.createProduct(req, res));
  router.get('/products', (req, res) => productController.getAllProducts(req, res));
  router.get('/products/:id', (req, res) => productController.getProductById(req, res));
  router.put('/products/:id', (req, res) => productController.updateProduct(req, res));
  router.delete('/products/:id', (req, res) => productController.deleteProduct(req, res));
  router.patch('/products/:id/stock', (req, res) => productController.updateProductStock(req, res));
}
