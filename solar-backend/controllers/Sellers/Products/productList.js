const db = require("../../../config/db");

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Fetch a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { price, stock_quantity } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE products SET price = ?, stock_quantity = ? WHERE id = ?",
      [price, stock_quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [updatedProduct] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    res.status(200).json(updatedProduct[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

module.exports = { getAllProducts, getProductById, updateProduct };