const Product = require('../models/Product');

class ProductService {
  async createProduct(productData) {
    try {
      return await Product.create(productData);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async getAllProducts(options = {}) {
    try {
      return await Product.findAll(options);
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const [updated] = await Product.update(updateData, {
        where: { id }
      });

      if (updated) {
        return this.getProductById(id);
      }
      throw new Error('Product not found');
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await Product.destroy({
        where: { id }
      });

      if (!deleted) {
        throw new Error('Product not found');
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

module.exports = new ProductService();
