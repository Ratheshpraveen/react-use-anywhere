const Product = require('../../src/models/Product');

describe('Product Model', () => {
  it('should create a new product', async () => {
    const productData = {
      category_id: 1,
      name: 'Test Product',
      description: 'A test product description',
      sku: 'TEST-SKU-001',
      price: 19.99,
      stock_quantity: 100
    };

    const product = await Product.create(productData);

    expect(product.name).toBe(productData.name);
    expect(product.price).toBe(productData.price);
    expect(product.stock_quantity).toBe(productData.stock_quantity);
  });

  it('should validate product creation', async () => {
    const invalidProductData = {
      name: '', // Empty name should fail
      price: -10 // Negative price should fail
    };

    await expect(Product.create(invalidProductData)).rejects.toThrow();
  });
});
