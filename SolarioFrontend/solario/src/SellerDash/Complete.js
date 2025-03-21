import React, { useState } from "react";
import "./Store.css";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    contactNumber: "",
    storePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, storePhoto: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // API call to save seller profile
  };

  return (
    <div className="profile-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Store Photo</label>
        <div className="photo-upload">
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          {formData.storePhoto && (
            <img
              src={URL.createObjectURL(formData.storePhoto)}
              alt="Store Preview"
              className="store-preview circle"
            />
          )}
        </div>

        <label>Store Name</label>
        <input
          type="text"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          required
        />

        <label>Store Address</label>
        <textarea
          name="storeAddress"
          value={formData.storeAddress}
          onChange={handleChange}
          required
        />

        <label>Contact Number</label>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-button">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
