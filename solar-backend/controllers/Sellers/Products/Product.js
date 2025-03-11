const db = require("../../../config/db");

const addProduct = async (req, res) => {
  const { productId, name, category, description, type, price, stockQuantity } = req.body;
  const productImage = req.file ? req.file.filename : null;
  const sellerId = req.user.id; // Seller ID is fetched from the authenticated user

  // Validate required fields
  if (!productId || !name || !category || !description || !type || !price || !stockQuantity || !productImage) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Insert product into the database
    const query = `
      INSERT INTO products (productId, name, category, description, type, price, stockQuantity, productImage, sellerId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [productId, name, category, description, type, price, stockQuantity, productImage, sellerId];

    await db.query(query, values);

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

module.exports = { addProduct };