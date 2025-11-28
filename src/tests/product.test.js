const request = require('supertest');
const app = require('../app');  // Adjust path to your main app file
const Product = require('../models/Product');
const Category = require('../models/Category');

describe('Product API', () => {
  let testCategory;
  let testProduct;

  beforeAll(async () => {
    // Create a test category
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'A category for testing'
    });
  });

  afterAll(async () => {
    // Clean up test data
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
  });

  test('should create a new product', async () => {
    const productData = {
      category_id: testCategory.id,
      name: 'Test Product',
      description: 'A product for testing',
      sku: 'TEST-SKU-001',
      price: 19.99,
      stock_quantity: 100
    };

    const response = await request(app)
      .post('/api/products')
      .send(productData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(productData.name);
    testProduct = response.body;
  });

  test('should get all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('should get a single product by ID', async () => {
    const response = await request(app)
      .get(`/api/products/${testProduct.id}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', testProduct.id);
  });

  test('should update a product', async () => {
    const updateData = {
      name: 'Updated Test Product',
      price: 29.99
    };

    const response = await request(app)
      .put(`/api/products/${testProduct.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body.name).toBe(updateData.name);
    expect(response.body.price).toBe(updateData.price);
  });

  test('should delete a product', async () => {
    await request(app)
      .delete(`/api/products/${testProduct.id}`)
      .expect(204);

    // Verify product is deleted
    const deletedProduct = await Product.findByPk(testProduct.id);
    expect(deletedProduct).toBeNull();
  });
});
