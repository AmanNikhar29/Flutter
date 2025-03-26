const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import controllers
const {
  getSeller,
  deleteSeller,
  registerSeller,
  getAllSellers,

} = require("../controllers/Sellers/sellerController");

const {
  getSellerDetails,
  getSellerAnalytics,
  getSellerEarnings,
  getSellerHistory,
} = require("../controllers/Sellers/Analytics/Analytics");

const { loginSeller } = require("../controllers/Sellers/SellerLogin");




// Middleware for authentication (placeholder)
const authenticateSeller = (req, res, next) => {
  // Add your authentication logic here
  req.user = { id: 1 }; // Example: Set seller ID to 1 for testing
  next();
};


router.post("/registerSeller", registerSeller); // Register seller with file upload
router.get("/getSeller/:id", getSeller); // Fetch a single seller by ID
router.get("/getAllSellers", getAllSellers); // Fetch all sellers
// router.put("/updateSeller/:id", updateSeller); // Update seller details
router.delete("/deleteSeller/:id", deleteSeller); // Delete a seller

// Seller login route
router.post("/login-seller", loginSeller);



// Analytics routes
router.get("/details", authenticateSeller, getSellerDetails); // Fetch seller details
router.get("/analytics", authenticateSeller, getSellerAnalytics); // Fetch seller analytics
router.get("/earnings", authenticateSeller, getSellerEarnings); // Fetch seller earnings
router.get("/history", authenticateSeller, getSellerHistory); // Fetch seller transaction history

module.exports = router;