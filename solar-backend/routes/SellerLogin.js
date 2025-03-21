const express = require("express");
const router = express.Router();

const { loginSeller } = require('../controllers/Sellers/SellerLogin')

router.post('/login-seller', loginSeller);

module.exports = router;


