import React, { useState } from 'react';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    storeName: '',
    storeAddress: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
    file: null, // Add a state for the uploaded file
  });

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [error, setError] = useState(null); // Error state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFormData({
        ...formData,
        file: file, // Store the file in state
      });
      alert(`File selected: ${file.name}`); // Notify the user
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if any field is empty
    for (const key in formData) {
      if (key !== 'file' && formData[key].trim() === '') {
        alert(`Please fill in all fields.`);
        return;
      }
    }

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.firstName);
    formDataToSend.append('last_name', formData.lastName);
    formDataToSend.append('store_name', formData.storeName);
    formDataToSend.append('store_address', formData.storeAddress);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('contact_no', formData.contactNo);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirm_password', formData.confirmPassword);
    if (formData.file) {
      formDataToSend.append('file', formData.file); // Append the file
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/seller/registerSeller", {
        method: "POST",
        body: formDataToSend, // Use FormData for file upload
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        console.log("Response Data:", data);
        setFormData({
          firstName: '',
          lastName: '',
          storeName: '',
          storeAddress: '',
          email: '',
          contactNo: '',
          password: '',
          confirmPassword: '',
          file: null, // Reset file state
        });
      } else {
        throw new Error(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-content">
          <h1 className="register-title">Welcome Seller!</h1>
          <p className="register-subtitle">Let's get started by filling out the form below.</p>
          
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className="form-inputRegister" />
              <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className="form-inputRegister" />
            </div>
            <input type="text" name="storeName" placeholder="Store Name" value={formData.storeName} onChange={handleChange} className="form-inputRegister" />
            <input type="text" name="storeAddress" placeholder="Store Address" value={formData.storeAddress} onChange={handleChange} className="form-inputRegister" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-inputRegister" />
            <input type="text" name="contactNo" placeholder="Contact No." value={formData.contactNo} onChange={handleChange} className="form-inputRegister" />
            
            <div className="password-input">
              <input type={passwordVisibility ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="form-inputRegister" />
              <span className="password-toggle" onClick={() => setPasswordVisibility(!passwordVisibility)}>
                {passwordVisibility ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <div className="password-input">
              <input type={confirmPasswordVisibility ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="form-inputRegister" />
              <span className="password-toggle" onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}>
                {confirmPasswordVisibility ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <div className="form-actions">
              <div className="tooltip-container">
              <label htmlFor="file-upload" className="upload-button">
                <span className="upload-icon">📁</span>
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: 'none' }} // Hide the default file input
                  onChange={handleFileChange} // Handle file selection
                />
              </label>
        <span className="tooltip-text">Click to upload Shop Certificate</span>
      </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
            <p className="sign-in-textReg">
              Already a member? <a href="/login" className="A">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;