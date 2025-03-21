const db = require("../../../config/db");

const addProduct = async (req, res) => {
  try {
    const { product_id, name, category, description, type, price, stock_quantity, seller_id } = req.body;

    const product_image = req.file ? req.file.filename : null;

    // Validate required fields
    if (!seller_id || !product_id || !name || !category || !description || !type || !price || !stock_quantity || !product_image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert seller_id to an integer
    const parsedSellerId = parseInt(seller_id, 10);
    if (isNaN(parsedSellerId)) {
      return res.status(400).json({ message: "Invalid seller_id" });
    }

    // Check if the seller exists
    const [seller] = await db.query("SELECT * FROM seller WHERE SellerId = ?", [parsedSellerId]);
    if (!seller.length) {  // Corrected seller existence check
      return res.status(400).json({ message: "Seller does not exist" });
    }
    
    // Insert product into the database
    const query = `
      INSERT INTO products (product_id, name, category, description, type, price, stock_quantity, product_image, seller_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [product_id, name, category, description, type, price, stock_quantity, product_image, parsedSellerId];

    await db.query(query, values);

    res.status(201).json({ message: "Product added successfully!", filename: product_image });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
  console.log("Received Data:", req.body);
console.log("Received File:", req.file);

};

const deleteProduct = async (req, res) => {
  const product_id = parseInt(req.params.id);

  try {
    // Check if the product exists
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Delete the product from the database
    await db.query('DELETE FROM products WHERE id = ?', [product_id]);

    // Send a success response
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'An error occurred while deleting the product.' });
  }
};


module.exports = { deleteProduct, addProduct };
