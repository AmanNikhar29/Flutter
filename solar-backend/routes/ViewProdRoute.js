const express = require('express');
const router = express.Router();
const productController = require('../controllers/Sellers/Products/productList')

// Fetch all products
router.get('/', productController.getAllProducts);

// Fetch a single product by ID
router.get('/:id', productController.getProductById);

// Update a product
router.put('/:id', productController.updateProduct);

module.exports = router;