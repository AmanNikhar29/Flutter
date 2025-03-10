const express = require("express");
const router = express.Router();
const { upload, uploadQuotation, getQuotations, updateQuotationStatus } = require("../controllers/Sellers/Quotation/quotation");

router.post("/upload", upload.single("quotation_file"), uploadQuotation);
router.get("/customer/:customer_id", getQuotations);
router.put("/update-status/:quotation_id", updateQuotationStatus);

module.exports = router;
