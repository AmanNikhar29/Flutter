const db = require('../../config/db');
const fs = require('fs');
const path = require('path');

const registerSeller = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      contact_no,
      store_name,
      store_address,
      password,
      confirm_password,
    } = req.body;

    const file = req.file;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !email ||
      !contact_no ||
      !store_name ||
      !store_address ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (!file) {
      return res.status(400).json({ error: 'Please upload a file.' });
    }

    const filePath = file.path; // Path to the uploaded certificate

    // Insert seller into the database with isVerified set to false
    await db.execute(
      'INSERT INTO Seller (first_name, last_name, email, contact_no, store_name, store_address, password, file, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, contact_no, store_name, store_address, password, filePath, false]
    );

    res.json({ message: 'Seller registered successfully. Awaiting verification.' });
  } catch (error) {
    console.error('Error registering seller:', error);
    res.status(500).json({ error: 'Error registering seller' });
  }
};

const verifySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Update the seller's verification status
    await db.execute('UPDATE Seller SET isVerified = ? WHERE id = ?', [true, sellerId]);

    res.json({ message: 'Seller verified successfully' });
  } catch (error) {
    console.error('Error verifying seller:', error);
    res.status(500).json({ error: 'Error verifying seller' });
  }
};

const getSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      'SELECT first_name, last_name, email, contact_no, store_name, store_address FROM Seller WHERE id = ?',
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
    const [sellers] = await db.execute('SELECT * FROM Seller'); // Fetch all sellers from the MySQL database
    res.status(200).json({ sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Error fetching sellers", error: error.message });
  }
};


const updateSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirm_password, contact_no } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Seller ID is required' });
    }

    if (!contact_no && !password) {
      return res.status(400).json({ error: 'At least one field (password or contact_no) is required for update' });
    }

    let query = 'UPDATE Seller SET';
    const values = [];
    
    if (contact_no) {
      query += ' contact_no = ?,';
      values.push(contact_no);
    }

    if (password) {
      if (!confirm_password || password !== confirm_password) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ' password = ?,';
      values.push(hashedPassword);
    }

    query = query.replace(/,$/, ' WHERE id = ?');
    values.push(id);

    await db.execute(query, values);

    res.json({ message: 'Seller profile updated successfully' });
  } catch (error) {
    console.error('Error updating seller details:', error);
    res.status(500).json({ error: 'Error updating seller details' });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM Seller WHERE id = ?', [id]);

    res.json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Error deleting seller' });
  }
};

const getUnverifiedSellers = async (req, res) => {
  try {
    const [sellers] = await db.execute('SELECT * FROM Seller WHERE isVerified = ?', [false]);
    res.status(200).json({ sellers });
  } catch (error) {
    console.error('Error fetching unverified sellers:', error);
    res.status(500).json({ error: 'Error fetching unverified sellers' });
  }
};

module.exports = { getSeller, deleteSeller, updateSeller, registerSeller, getAllSellers, verifySeller, getUnverifiedSellers };