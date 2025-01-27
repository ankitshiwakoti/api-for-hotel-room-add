const express = require('express');
const router = express.Router();

// inlcude productController
const productController = require('../controllers/productController');

router.get('/', productController.getIndex);
//router.get('/', productController.getProduct);

module.exports = router;
