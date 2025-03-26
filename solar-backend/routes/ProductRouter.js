const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const productController = require("../controllers/Sellers/Products/Product");
const {deleteProduct,addProduct,getAllProducts,getAllProductsId} = require("../controllers/Sellers/Products/Product");

// ✅ Ensure 'uploads' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer Storage for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

// ✅ Filter to Accept Only Image Files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, PNG, WEBP) are allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ✅ Route to Upload File Directly (for testing)
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully!", filename: req.file.filename });
});

// ✅ Route to Add New Product (Ensure 'product_image' is sent from frontend)
router.post("/", upload.single("product_image"), addProduct);
router.delete('/delproduct/:id',deleteProduct);
router.get('/getProducts',getAllProducts)
router.get('/ParticularProduct/:id',getAllProductsId);
module.exports = router;
