const express = require("express");
const router = express.Router();
const productController = require('../controllers/Sellers/Products/Product')
const authenticateSeller = require("../middleware/authmiddleware")
const multer = require("multer");
const path = require("path");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save uploaded files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Ensure the "uploads" folder exists
const fs = require("fs");
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Add a new product

router.post("/add-Product", authenticateSeller, upload.single("productImage"),productController.addProduct);
module.exports = router;