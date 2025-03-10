const express = require("express");
const router = express.Router();
const { getProduct,deleteProduct,updateProduct,addProduct } = require("../controllers/Sellers/Products/Product"); // Ensure this is correctly imported


router.get("/getProduct/:id", getProduct);
router.delete("/deleteProduct/:id", deleteProduct); // Ensure this function is defined in CustomerController.js
router.put("/updateProduct/:id", updateProduct);

router.post("/addProduct", addProduct);



module.exports = router; // Export the router
