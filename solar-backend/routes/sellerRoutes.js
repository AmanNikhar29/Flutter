const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import controllers
const {
  getSeller,
  deleteSeller,
  updateSeller,
  registerSeller,
  getAllSellers,
  verifySeller,
  getUnverifiedSellers,
} = require("../controllers/Sellers/sellerController");

const {
  getSellerDetails,
  getSellerAnalytics,
  getSellerEarnings,
  getSellerHistory,
} = require("../controllers/Sellers/Analytics/Analytics");

const { loginSeller } = require("../controllers/Sellers/SellerLogin");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Middleware for authentication (placeholder)
const authenticateSeller = (req, res, next) => {
  // Add your authentication logic here
  req.user = { id: 1 }; // Example: Set seller ID to 1 for testing
  next();
};

// Seller registration and management routes
router.post("/registerSeller", upload.single("file"), registerSeller); // Register seller with file upload
router.get("/getSeller/:id", getSeller); // Fetch a single seller by ID
router.get("/getAllSellers", getAllSellers); // Fetch all sellers
// router.put("/updateSeller/:id", updateSeller); // Update seller details
router.delete("/deleteSeller/:id", deleteSeller); // Delete a seller

// Seller login route
router.post("/login-seller", loginSeller);

// Verification routes
router.get("/unverified", getUnverifiedSellers); // Fetch unverified sellers
router.put("/verify/:sellerId", verifySeller); // Verify a seller

// Analytics routes
router.get("/details", authenticateSeller, getSellerDetails); // Fetch seller details
router.get("/analytics", authenticateSeller, getSellerAnalytics); // Fetch seller analytics
router.get("/earnings", authenticateSeller, getSellerEarnings); // Fetch seller earnings
router.get("/history", authenticateSeller, getSellerHistory); // Fetch seller transaction history

module.exports = router;