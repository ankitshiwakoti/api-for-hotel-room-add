const express = require('express');
const productsController = require('../controllers/productController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', isAuth, productsController.getProducts);

// /admin/add-product => GET
router.get('/add-product',isAuth, productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product',isAuth,productsController.postAddProduct);

router.get('/edit-product/:productId',isAuth, productsController.getEditProduct);

router.post('/edit-product', isAuth,productsController.postEditProduct);

router.post('/delete-product', isAuth,productsController.postDeleteProduct);

router.get('/api/products', productsController.getAllProducts);

module.exports = router;

