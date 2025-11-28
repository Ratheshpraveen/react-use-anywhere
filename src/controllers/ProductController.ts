import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { ProductCreateDTO, ProductUpdateDTO } from '../models/Product';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: ProductCreateDTO = req.body;
      const product = await this.productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await this.productService.findProductById(id);
      
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const productData: ProductUpdateDTO = req.body;
      const updatedProduct = await this.productService.updateProduct(id, productData);
      
      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await this.productService.deleteProduct(id);
      
      if (!deleted) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProductStock(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number') {
        res.status(400).json({ message: 'Invalid quantity' });
        return;
      }
      
      const updatedProduct = await this.productService.updateProductStock(id, quantity);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
