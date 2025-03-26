const db = require("../../../config/db");
const path = require("path");
const fs = require("fs");

// Helper function to calculate profile completion
const calculateProgress = (profileData) => {
  const requiredFields = [
    'store_name', 'street', 'city', 'state', 'zip_code', 'country',
    'gst_number', 'store_license_number', 'compliance_certificate', 'upi_id'
  ];
  
  const completedFields = requiredFields.filter(field => 
    profileData[field] && profileData[field].toString().trim() !== ''
  ).length;
  
  return Math.round((completedFields / requiredFields.length) * 100);
};

// Get existing store profile
const getStoreProfile = async (req, res) => {
  try {
    const sellerId = req.headers['seller-id'];
    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const [profile] = await db.query(
      `SELECT * FROM store_profiles WHERE seller_id = ?`,
      [sellerId]
    );

    if (profile.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Ensure store_photos is always a string
    const profileData = profile[0];
    profileData.store_photos = profileData.store_photos || ''; // Handle null case
    
    res.json({
      data: {
        ...profileData,
        store_photos: profileData.store_photos.split(',').filter(Boolean) // Convert to array and remove empty strings
      },
      progress: calculateProgress(profileData)
    });
  } catch (error) {
    console.error("Error fetching store profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Save or update store profile
const saveStoreProfile = async (req, res) => {
  try {
    const sellerId = req.headers['seller-id'];
    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const { body, files } = req;
    const profileData = {
      seller_id: sellerId,
      store_name: body.storeName,
      street: body.street,
      city: body.city,
      state: body.state,
      zip_code: body.zipCode,
      country: body.country,
      gst_number: body.gstNumber,
      store_license_number: body.storeLicenseNumber,
      upi_id: body.upiId
    };

    // Handle file uploads
    if (files) {
      if (files.storeLogo) {
        profileData.store_logo = `/uploads/${files.storeLogo[0].filename}`;
      }
      if (files.complianceCertificate) {
        profileData.compliance_certificate = `/uploads/${files.complianceCertificate[0].filename}`;
      }
      if (files.storePhotos) {
        profileData.store_photos = files.storePhotos.map(file => `/uploads/${file.filename}`).join(',');
      }
    }

    // Check if profile exists
    const [existingProfile] = await db.query(
      `SELECT id FROM store_profiles WHERE seller_id = ?`,
      [sellerId]
    );

    if (existingProfile.length > 0) {
      // Update existing profile
      await db.query(
        `UPDATE store_profiles SET 
          store_name = ?, street = ?, city = ?, state = ?, zip_code = ?, country = ?,
          store_logo = ?, gst_number = ?, store_license_number = ?,
          compliance_certificate = ?, upi_id = ?, store_photos = ?
         WHERE seller_id = ?`,
        [
          profileData.store_name,
          profileData.street,
          profileData.city,   
          profileData.state,
          profileData.zip_code,
          profileData.country,
          profileData.store_logo,
          profileData.gst_number,
          profileData.store_license_number,
          profileData.compliance_certificate,
          profileData.upi_id,
          profileData.store_photos || null,
          sellerId
        ]
      );
    } else {
      // Create new profile
      await db.query(
        `INSERT INTO store_profiles (
          seller_id, store_name, street, city, state, zip_code, country,
          store_logo, gst_number, store_license_number, compliance_certificate, 
          upi_id, store_photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profileData.seller_id,
          profileData.store_name,
          profileData.street,
          profileData.city,
          profileData.state,
          profileData.zip_code,
          profileData.country,
          profileData.store_logo,
          profileData.gst_number,
          profileData.store_license_number,
          profileData.compliance_certificate,
          profileData.upi_id,
          profileData.store_photos || null
        ]
      );
    }

    const progress = calculateProgress(profileData);
    
    res.json({
      message: "Profile saved successfully",
      progress
    });
  } catch (error) {
    console.error("Error saving store profile:", error);
    
    // Clean up uploaded files if error occurred
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlink(path.join(__dirname, '../../../uploads', file.filename), () => {});
        });
      });
    }
    
    res.status(500).json({ message: "Failed to save profile" });
  }
};
// Add this new function to your existing code
const getStoreDetails = async (req, res) => {
  try {
    const sellerId = req.headers['seller-id'];
    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const [profile] = await db.query(
      `SELECT store_name, city, store_photos, store_logo FROM store_profiles WHERE seller_id = ?`,
      [sellerId]
    );

    if (profile.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const storeData = profile[0];
    
    // Get the first store photo if available, otherwise use store logo
    const photos = storeData.store_photos ? storeData.store_photos.split(',').filter(Boolean) : [];
    const storePhoto = photos.length > 0 ? photos[0] : storeData.store_logo || null;

    res.json({
      storeName: storeData.store_name,
      storeCity: storeData.city,
      storePhoto: storePhoto
    });
  } catch (error) {
    console.error("Error fetching store details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update your exports to include the new function
module.exports = { 
  getStoreProfile, 
  saveStoreProfile,
  getStoreDetails
};
