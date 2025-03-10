const express = require("express");
const router = express.Router();

const { loginSeller } = require('../controllers/Sellers/Seller');

router.post('/login-seller', loginSeller);

module.exports = router;


