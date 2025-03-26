import React, { useState } from 'react';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if any field is empty
    for (const key in formData) {
      if (formData[key].trim() === '') {
        alert(`Please fill in all fields.`);
        return;
      }
    }

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/seller/registerSeller", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("sellerId", data.sellerId);
        alert("Registration successful!");
        console.log("Response Data:", data);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          contactNo: '',
          password: '',
          confirmPassword: '',
        });
        navigate('/login');
      } else {
        throw new Error(data.error || "Registration failed.");
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
              <button type="submit" className="submit-button11" disabled={loading}>
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