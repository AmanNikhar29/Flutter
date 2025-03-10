const db = require('../../config/db');

const loginSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch seller from the database
    const [seller] = await db.execute('SELECT * FROM Seller WHERE email = ?', [email]);

    if (seller.length === 0) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Compare passwords
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

    // Return seller details (excluding password)
    const sellerDetails = {
      id: seller[0].id,
      first_name: seller[0].first_name,
      last_name: seller[0].last_name,
      email: seller[0].email,
      store_name: seller[0].store_name,
      store_address: seller[0].store_address,
    };

    res.status(200).json({ message: 'Login successful', seller: sellerDetails });
    console.log(sellerDetails);
  } catch (error) {
    console.error('Error logging in seller:', error);
    res.status(500).json({ message: 'Error logging in seller', error });
  }
};
module.exports = { loginSeller };
