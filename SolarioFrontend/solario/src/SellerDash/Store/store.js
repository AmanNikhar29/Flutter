import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './storee.css';

const StoreProfile = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    gstNumber: '',
    storeLicenseNumber: '',
    upiId: '',
  });
  const [storeLogo, setStoreLogo] = useState(null);
  const [complianceCertificate, setComplianceCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [storePhotos, setStorePhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sellerId = localStorage.getItem('sellerId');
        if (!sellerId) return;
        
        const response = await axios.get('http://localhost:5000/api/profile/get', {
          headers: { 'seller-id': sellerId }
        });
        
        if (response.data.data) {
          setFormData({
            storeName: response.data.data.store_name || '',
            street: response.data.data.street || '',
            city: response.data.data.city || '',
            state: response.data.data.state || '',
            zipCode: response.data.data.zip_code || '',
            country: response.data.data.country || '',
            gstNumber: response.data.data.gst_number || '',
            storeLicenseNumber: response.data.data.store_license_number || '',
            upiId: response.data.data.upi_id || '',
          });
    
          setExistingPhotos(response.data.data.store_photos || []);
          setProgress(response.data.progress || 0);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status !== 404) {
          setMessage('Error loading profile data');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStorePhotosChange = (e) => {
    if (e.target.files && e.target.files.length + storePhotos.length <= 5) {
      setStorePhotos([...storePhotos, ...Array.from(e.target.files)]);
    } else {
      setMessage('You can upload a maximum of 5 photos');
    }
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removePhoto = (index, isExisting) => {
    if (isExisting) {
      setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
    } else {
      setStorePhotos(storePhotos.filter((_, i) => i !== index));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.storeName || !formData.street || !formData.city || 
          !formData.state || !formData.zipCode || !formData.country) {
        setMessage('Please fill all required fields');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const sellerId = localStorage.getItem('sellerId');
      if (!sellerId) throw new Error('Seller ID not found');

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (storeLogo) formDataToSend.append('storeLogo', storeLogo);
      if (complianceCertificate) formDataToSend.append('complianceCertificate', complianceCertificate);
      
      storePhotos.forEach(photo => formDataToSend.append('storePhotos', photo));
      existingPhotos.forEach(photo => formDataToSend.append('existingPhotos', photo));
      
      const response = await axios.post('http://localhost:5000/api/profile/save', formDataToSend, {
        headers: {
          'seller-id': sellerId,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Profile saved successfully!');
      setProgress(response.data.progress);
      setStorePhotos([]);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepOne = () => (
    <div className="step-container">
      <div className="form-section">
        <h2>Store Information</h2>
        <div className="form-group-store">
          <label htmlFor="storeName">Store Name*</label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
            autoComplete="organization"
          />
        </div>

        <div className="form-group-store">
          <label htmlFor="storeLogo">Store Logo</label>
          <input
            type="file"
            id="storeLogo"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setStoreLogo)}
            className="file-input"
          />
          {storeLogo && (
            <div className="photo-preview">
              <div className="preview-item">
                <img src={URL.createObjectURL(storeLogo)} alt="Logo preview" />
                <button 
                  type="button" 
                  onClick={() => setStoreLogo(null)}
                  className="remove-photo-btn"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-group-store">
          <label htmlFor="storePhotos">Store Photos (Max 5)</label>
          <input
            type="file"
            id="storePhotos"
            accept="image/*"
            multiple
            onChange={handleStorePhotosChange}
            disabled={storePhotos.length + existingPhotos.length >= 5}
            className="file-input"
          />
          <p className="file-hint">You can upload up to 5 photos</p>
          
          {(storePhotos.length > 0 || existingPhotos.length > 0) && (
            <div className="photo-preview">
              {existingPhotos.map((photo, index) => (
                <div key={`existing-${index}`} className="preview-item">
                  <img src={`http://localhost:5000${photo}`} alt={`Existing ${index}`} />
                  <button 
                    type="button" 
                    onClick={() => removePhoto(index, true)}
                    className="remove-photo-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {storePhotos.map((photo, index) => (
                <div key={`new-${index}`} className="preview-item">
                  <img src={URL.createObjectURL(photo)} alt={`New ${index}`} />
                  <button 
                    type="button" 
                    onClick={() => removePhoto(index, false)}
                    className="remove-photo-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <h2>Store Address</h2>
        <div className="form-group-store">
          <label htmlFor="street">Street Address*</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            autoComplete="street-address"
          />
        </div>
        
        <div className={`form-row ${isMobile ? 'mobile-column' : ''}`}>
          <div className="form-group-store">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              autoComplete="address-level2"
            />
          </div>
          
          <div className="form-group-store">
            <label htmlFor="state">State*</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              autoComplete="address-level1"
            />
          </div>
        </div>
        
        <div className={`form-row ${isMobile ? 'mobile-column' : ''}`}>
          <div className="form-group-store">
            <label htmlFor="zipCode">ZIP Code*</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              autoComplete="postal-code"
            />
          </div>
          
          <div className="form-group-store">
            <label htmlFor="country">Country*</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              autoComplete="country"
            />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" onClick={nextStep} className="next-button-store">
          Next: Business Verification
        </button>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="step-container">
      <div className="form-section">
        <h2>Business Verification</h2>
        <div className="form-group-store">
          <label htmlFor="gstNumber">GST Number*</label>
          <input
            type="text"
            id="gstNumber"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group-store">
          <label htmlFor="storeLicenseNumber">Store License Number*</label>
          <input
            type="text"
            id="storeLicenseNumber"
            name="storeLicenseNumber"
            value={formData.storeLicenseNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group-store">
          <label htmlFor="complianceCertificate">Compliance Certificate*</label>
          <input
            type="file"
            id="complianceCertificate"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleFileChange(e, setComplianceCertificate)}
            required
            className="file-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Payment Information</h2>
        <div className="form-group-store">
          <label htmlFor="upiId">UPI ID*</label>
          <input
            type="text"
            id="upiId"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            placeholder="yourname@upi"
            required
          />
        </div>
      </div>

      <div className="step-actions">
        <button type="button" onClick={prevStep} className="back-button-store">
          Back to Store Info
        </button>
        <button type="submit" className="submit-button-store" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="store-profile-container">
        <h1>Complete Your Store Profile</h1>
        <p className="progress-text">Profile Completion: {progress}%</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="step-indicator">
          <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
            <span className="step-number"></span>
            <span className="step-label">Store Information</span>
          </div>
          <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
            <span className="step-number"></span>
            <span className="step-label">Business Details</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="store-profile-form">
          {currentStep === 1 ? renderStepOne() : renderStepTwo()}
          {message && <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default StoreProfile;