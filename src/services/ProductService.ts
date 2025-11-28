import { Product, ProductCreateDTO, ProductUpdateDTO } from '../models/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async createProduct(productData: ProductCreateDTO): Promise<Product> {
    // Add validation logic
    if (!productData.name || !productData.sku) {
      throw new Error('Name and SKU are required');
    }

    // Check for duplicate SKU
    const existingProduct = await this.findProductBySku(productData.sku);
    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    return this.productRepository.create(productData);
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async findProductBySku(sku: string): Promise<Product | null> {
    const products = await this.productRepository.findAll();
    return products.find(p => p.sku === sku) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async updateProduct(id: number, productData: ProductUpdateDTO): Promise<Product | null> {
    // Add validation logic
    if (productData.sku) {
      const existingProduct = await this.findProductBySku(productData.sku);
      if (existingProduct && existingProduct.id !== id) {
        throw new Error('Product with this SKU already exists');
      }
    }

    return this.productRepository.update(id, productData);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  async updateProductStock(id: number, quantity: number): Promise<Product | null> {
    const product = await this.findProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return this.updateProduct(id, { 
      stockQuantity: Math.max(0, (product.stockQuantity || 0) + quantity) 
    });
  }
}
