const db = require("../../../config/db");

const addProduct = async (req, res) => {
  try {
    const { product_id, name, category, description, type, price, stock_quantity, seller_id } = req.body;
    const product_image = req.file ? req.file.filename : null;

    if (!seller_id || !product_id || !name || !category || !description || !type || !price || !stock_quantity || !product_image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedSellerId = parseInt(seller_id, 10);
    if (isNaN(parsedSellerId)) {
      return res.status(400).json({ message: "Invalid seller_id" });
    }

    const [seller] = await db.query("SELECT * FROM seller WHERE SellerId = ?", [parsedSellerId]);
    if (!seller.length) {
      return res.status(400).json({ message: "Seller does not exist" });
    }
    
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
};

const deleteProduct = async (req, res) => {
  const product_id = parseInt(req.params.id);

  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [product_id]);
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'An error occurred while deleting the product.' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const getAllProductsId = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.query('SELECT * FROM products where seller_id = ?',[id]);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

module.exports = { deleteProduct, addProduct, getAllProducts, getAllProductsId };
