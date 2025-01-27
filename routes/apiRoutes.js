// apiRoutes.js
const express = require('express');
const productsController = require('../controllers/productController');

const router = express.Router();

// API route for getting all products
router.get('/api/products', productsController.getAllProducts);

module.exports = router;
