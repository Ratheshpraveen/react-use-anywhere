import { ProductService } from '../src/services/ProductService';
import { ProductRepository } from '../src/repositories/ProductRepository';
import { Database } from '../src/database/Database';
import { ProductCreateDTO } from '../src/models/Product';

describe('ProductService', () => {
  let productService: ProductService;
  let mockRepository: jest.Mocked<ProductRepository>;
  let mockDatabase: jest.Mocked<Database>;

  beforeEach(() => {
    mockDatabase = {
      execute: jest.fn(),
      query: jest.fn()
    } as any;

    mockRepository = new ProductRepository(mockDatabase) as jest.Mocked<ProductRepository>;
    productService = new ProductService(mockRepository);
  });

  describe('createProduct', () => {
    const validProductData: ProductCreateDTO = {
      categoryId: 1,
      name: 'Test Product',
      sku: 'TEST-001',
      price: 19.99,
      stockQuantity: 10
    };

    it('should create a product successfully', async () => {
      mockRepository.findAll = jest.fn().mockResolvedValue([]);
      mockRepository.create = jest.fn().mockResolvedValue({
        id: 1,
        ...validProductData
      });

      const result = await productService.createProduct(validProductData);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(validProductData.name);
    });

    it('should throw error for duplicate SKU', async () => {
      mockRepository.findAll = jest.fn().mockResolvedValue([
        { sku: 'TEST-001' }
      ]);

      await expect(productService.createProduct(validProductData))
        .rejects.toThrow('Product with this SKU already exists');
    });
  });

  describe('updateProductStock', () => {
    it('should update product stock quantity', async () => {
      const existingProduct = {
        id: 1,
        stockQuantity: 10,
        categoryId: 1,
        name: 'Test Product',
        sku: 'TEST-001',
        price: 19.99
      };

      mockRepository.findById = jest.fn().mockResolvedValue(existingProduct);
      mockRepository.update = jest.fn().mockResolvedValue({
        ...existingProduct,
        stockQuantity: 15
      });

      const result = await productService.updateProductStock(1, 5);

      expect(result?.stockQuantity).toBe(15);
    });

    it('should not allow negative stock', async () => {
      const existingProduct = {
        id: 1,
        stockQuantity: 10,
        categoryId: 1,
        name: 'Test Product',
        sku: 'TEST-001',
        price: 19.99
      };

      mockRepository.findById = jest.fn().mockResolvedValue(existingProduct);
      mockRepository.update = jest.fn().mockResolvedValue({
        ...existingProduct,
        stockQuantity: 0
      });

      const result = await productService.updateProductStock(1, -15);

      expect(result?.stockQuantity).toBe(0);
    });
  });
});
