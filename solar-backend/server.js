require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Database connection

// Import routes
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/ProductRouter");
const quotRoutes = require("./routes/quotRoutes");
const forgotPasswordRoutes = require("./routes/ForgotPassRoutes");

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Test database connection
db.getConnection()
  .then((connection) => {
    console.log("Database connected successfully!");
    connection.release(); // Release the connection
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process if the database connection fails
  });

// Routes
app.use("/api/seller", sellerRoutes); // Seller-related routes
app.use("/api/products", productRoutes); // Product-related routes
app.use("/api/quotations", quotRoutes); // Quotation-related routes
app.use("/api/forgot-password", forgotPasswordRoutes); // Forgot password routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is up and running" });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});