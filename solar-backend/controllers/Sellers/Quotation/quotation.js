const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../../../config/db");

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/QUOTATIONS/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer Upload Middleware
const upload = multer({ storage: storage });

// **Upload Quotation API**
const uploadQuotation = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { request_id, seller_id, customer_id } = req.body;
  const quotationFilePath = req.file.path;

  const sql = `
    INSERT INTO quotations (request_id, seller_id, customer_id, quotation_file, status) 
    VALUES (?, ?, ?, ?, 'pending')
  `;

  db.query(sql, [request_id, seller_id, customer_id, quotationFilePath], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Quotation uploaded successfully", quotation_id: result.insertId });
  });
};

module.exports = { upload, uploadQuotation };

// **Get Quotations for a Specific Customer**
const getQuotations = (req, res) => {
  const { customer_id } = req.params;
  const sql = "SELECT * FROM quotations WHERE customer_id = ?";

  db.query(sql, [customer_id], (err, results) => {
    if (err) {
      console.error("Error fetching quotations:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// **Update Quotation Status (Accept/Reject)**
const updateQuotationStatus = (req, res) => {
  const { quotation_id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const sql = "UPDATE quotations SET status = ? WHERE quotation_id = ?";
  db.query(sql, [status, quotation_id], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: `Quotation ${status} successfully` });
  });
};

module.exports = { upload, uploadQuotation, getQuotations, updateQuotationStatus };
