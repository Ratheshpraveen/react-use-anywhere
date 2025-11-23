const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connection');

class Product extends Model {
  static associate(models) {
    // Define associations here
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
    validate: {
      notNull: {
        msg: 'Category is required'
      }
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Product name is required'
      },
      len: {
        args: [1, 255],
        msg: 'Product name must be between 1 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING(100),
    unique: true,
    validate: {
      len: {
        args: [1, 100],
        msg: 'SKU must be between 1 and 100 characters'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Price must be a decimal number'
      },
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      }
    }
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Stock quantity must be an integer'
      },
      min: {
        args: [0],
        msg: 'Stock quantity cannot be negative'
      }
    }
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Product;
