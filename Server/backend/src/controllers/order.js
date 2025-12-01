const { Order, OrderItem } = require('../models/order.model');
const Product = require('../models/product.model');
const { sequelize } = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.userId },
      include: [{
        model: Product,
        as: 'items',
        through: { attributes: ['quantity', 'priceAtTime'] }
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items, shippingAddress } = req.body;
    let totalAmount = 0;

    // Validate stock and calculate total
    for (const item of items) {
      const product = await Product.findByPk(item.product, { transaction: t });
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      totalAmount += parseFloat(product.price) * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId: req.user.userId,
      totalAmount,
      shippingAddress
    }, { transaction: t });

    // Create order items and update stock
    for (const item of items) {
      const product = await Product.findByPk(item.product, { transaction: t });
      
      await OrderItem.create({
        orderId: order.id,
        productId: item.product,
        quantity: item.quantity,
        priceAtTime: product.price
      }, { transaction: t });

      await product.update({
        stock: product.stock - item.quantity
      }, { transaction: t });
    }

    await t.commit();

    // Fetch the complete order with products
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: Product,
        as: 'items',
        through: { attributes: ['quantity', 'priceAtTime'] }
      }]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};