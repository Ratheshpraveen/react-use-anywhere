const Product = require('../models/Product');

class ProductService {
  async createProduct(productData) {
    return await Product.create(productData);
  }

  async getProducts(page, limit) {
    const offset = (page - 1) * limit;
    return await Product.findAndCountAll({
      limit: Number(limit),
      offset: offset
    });
  }

  async getProductById(id) {
    return await Product.findByPk(id);
  }

  async updateProduct(id, updateData) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return await product.update(updateData);
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await product.destroy();
  }
}

module.exports = new ProductService();
