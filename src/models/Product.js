const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');  // Assuming you have a Category model

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
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
  tableName: 'Products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Product.belongsTo(Category, { 
  foreignKey: 'category_id', 
  as: 'category' 
});

module.exports = Product;
