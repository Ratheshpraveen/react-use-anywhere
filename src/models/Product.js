const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

class Product extends Model {
  static associate(models) {
    // Define associations
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
  }
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'Products',
  timestamps: true,
  underscored: true
});

module.exports = Product;
