const db = require('../../config/db');
const fs = require('fs');


const registerSeller = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNo,
      password,
      confirmPassword,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !contactNo || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Insert query
    const insertQuery = `
      INSERT INTO sellers (first_name, last_name, email, contact_no, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertValues = [firstName, lastName, email, contactNo, password];

    // Execute the INSERT query
    const [insertResult] = await db.execute(insertQuery, insertValues);

    // Retrieve the auto-generated seller ID
    const [idResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
    const sellerId = idResult[0].id;

    res.status(201).json({ message: 'Seller registered successfully.', sellerId });
  } catch (error) {
    console.error('Error registering seller:', error);

    // Handle duplicate email or contact number errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email or contact number already exists.' });
    }

    res.status(500).json({ error: 'Error registering seller' });
  }
};


const getSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      'SELECT store_name, city ,store_photos,seller_id FROM store_profiles WHERE seller_id = ?',
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching seller details:', error);
    res.status(500).json({ error: 'Error fetching seller details' });
  }
};

const getAllSellers = async (req, res) => {
  try {
    const [sellers] = await db.execute('SELECT store_name, city ,store_photos,seller_id FROM store_profiles'); // Fetch all sellers from the MySQL database
    res.status(200).json({ sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Error fetching sellers", error: error.message });
  }
};


const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM sellers WHERE id = ?', [id]);

    res.json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Error deleting seller' });
  }
};

// const getUnverifiedSellers = async (req, res) => {
//   try {
//     const [sellers] = await db.execute('SELECT * FROM sellers WHERE isVerified = ?', [false]);
//     res.status(200).json({ sellers });
//   } catch (error) {
//     console.error('Error fetching unverified sellers:', error);
//     res.status(500).json({ error: 'Error fetching unverified sellers' });
//   }
// };

module.exports = { getSeller, deleteSeller, registerSeller, getAllSellers};