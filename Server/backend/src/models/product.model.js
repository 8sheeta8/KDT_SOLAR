const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('residential', 'commercial', 'industrial'),
    allowNull: false
  },
  wattage: {
    type: DataTypes.INTEGER
  },
  efficiency: {
    type: DataTypes.DECIMAL(5, 2)
  },
  warranty: {
    type: DataTypes.INTEGER
  },
  dimensions: {
    type: DataTypes.STRING
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true
});

module.exports = Product;