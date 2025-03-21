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
    const insertQuery = `
      INSERT INTO Seller (first_name, last_name, email, contact_no, store_name, store_address, password, file, isVerified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [first_name, last_name, email, contact_no, store_name, store_address, password, filePath, false];

    // Execute the INSERT query
    const [insertResult] = await db.execute(insertQuery, insertValues);

    // Retrieve the auto-generated seller ID
    const [idResult] = await db.execute('SELECT LAST_INSERT_ID() AS id');
    const sellerId = idResult[0].id;

    res.status(201).json({ message: 'Seller registered successfully. Awaiting verification.', sellerId });
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

module.exports = { getSeller, deleteSeller, registerSeller, getAllSellers, verifySeller, getUnverifiedSellers };