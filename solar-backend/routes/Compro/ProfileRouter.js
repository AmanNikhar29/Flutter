const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getStoreProfile, saveStoreProfile, getStoreDetails } = require("../../controllers/Sellers/Profile/ComPro");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 7 // Max 7 files total (1 logo, 1 cert, and up to 5 photos)
  }
});

// Updated upload fields to include storePhotos
const uploadFields = upload.fields([
  { name: 'storeLogo', maxCount: 1 },
  { name: 'complianceCertificate', maxCount: 1 },
  { name: 'storePhotos', maxCount: 5 }
]);


router.get('/get', getStoreProfile);
router.get('/Stores',getStoreDetails)
router.post('/save', uploadFields, saveStoreProfile);

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle specific Multer errors
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size too large. Maximum 5MB allowed.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field.';
    }
    return res.status(400).json({ 
      success: false,
      message 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
  next();
});

module.exports = router;