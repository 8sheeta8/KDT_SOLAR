const router = require('express').Router();
const authController = require('./controllers/auth');
const productController = require('./controllers/product');
const orderController = require('./controllers/order');
const authMiddleware = require('./middlewares/auth');

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Product routes
router.get('/products', productController.getAll);
router.get('/products/:id', productController.getOne);
router.post('/products', authMiddleware, productController.create);
router.put('/products/:id', authMiddleware, productController.update);
router.delete('/products/:id', authMiddleware, productController.delete);

// Order routes
router.get('/orders', authMiddleware, orderController.getAll);
router.post('/orders', authMiddleware, orderController.create);

module.exports = router;