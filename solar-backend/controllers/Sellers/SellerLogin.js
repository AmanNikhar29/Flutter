const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const loginSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the seller exists
    const [seller] = await db.query("SELECT * FROM sellers WHERE email = ?", [email]);

    if (!seller || seller.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Validate password (assuming passwords are hashed)
    const isValidPassword = await bcrypt.compare(password, seller[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: seller[0].id, email: seller[0].email }, // Include seller ID in the token
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({ token, sellerId: seller[0].id });
  } catch (error) {
    console.error("Error logging in seller:", error);
    res.status(500).json({ message: "Failed to log in seller" });
  }
};

module.exports = { loginSeller };