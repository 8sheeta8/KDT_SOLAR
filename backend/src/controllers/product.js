const Product = require('../models/product.model');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const { category, sort, limit = 10, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where = category ? { category } : {};
    const order = sort ? [[sort, 'ASC']] : [['createdAt', 'DESC']];

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit: Number(limit),
      offset
    });

    res.json({
      products,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: Number(page)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findByPk(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};