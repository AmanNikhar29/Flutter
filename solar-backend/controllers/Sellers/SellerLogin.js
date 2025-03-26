const db = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginSeller = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Fetch seller from the database
        const [seller] = await db.execute("SELECT * FROM sellers WHERE email = ?", [email]);

        if (seller.length === 0) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Compare passwords (direct comparison, NOT secure for production)
        if (password !== seller[0].password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Extract Seller ID
        const sellerId = seller[0].sellerId;

        // Generate JWT Token
        const token = jwt.sign(
            { sellerId: sellerId, email: seller[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Exclude password from response
        const sellerDetails = {
            sellerId: sellerId,
            first_name: seller[0].first_name,
            last_name: seller[0].last_name,
            email: seller[0].email,
            store_name: seller[0].store_name,
            store_address: seller[0].store_address,
        };

        console.log("Seller ID:", sellerId); // Log Seller ID in console

        res.status(200).json({
            message: "Login successful",
            token,
            sellerId,  // Return Seller ID in the response
            seller: sellerDetails
        });

    } catch (error) {
        console.error("Error logging in seller:", error);
        res.status(500).json({ message: "Error logging in seller", error });
    }
};

module.exports = { loginSeller };
