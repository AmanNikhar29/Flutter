require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Database connection
const path = require("path");

// Import routes
const storeProfileRoutes = require("./routes/Compro/ProfileRouter");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/ProductRouter");
const quotRoutes = require("./routes/quotRoutes");
const forgotPasswordRoutes = require("./routes/ForgotPassRoutes");
const viewProd = require("./routes/ViewProdRoute");

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Check Database Connection
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
app.use("/api/seller", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotations", quotRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
app.use("/api/product", viewProd);
app.use("/api/profile", storeProfileRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is up and running" });
});

// 404 Handler (for undefined routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});