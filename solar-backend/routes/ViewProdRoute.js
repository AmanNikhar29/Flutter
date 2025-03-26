const express = require('express');
const router = express.Router();
const {getAllProducts,updateProduct} = require('../controllers/Sellers/Products/productList')
const {getAllProductsId} = require('../controllers/Sellers/Products/Product')
// Fetch all products
router.get('/', getAllProducts);

// Fetch a single product by ID
router.get('/:id', getAllProductsId);

// Update a product
router.put('/:id', updateProduct);

module.exports = router;