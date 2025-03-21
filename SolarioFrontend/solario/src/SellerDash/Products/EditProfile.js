import React, { useState } from 'react';
import './edit.css';
import SuccessProfile from './success';


const EditProfile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSaveChanges = async () => {
    // Validate inputs
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    // Call API to save changes
    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          contactNo,
        }),
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  const handleCancel = () => {
    // Navigate back or reset form
    window.history.back();
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>Change Your Credentials Here</h1>
        <p>Fill out the following form to change your profile credentials.</p>
        <div className="divider"></div>
      </div>

      <div className="edit-profile-form">
        <h2>Edit Your Profile</h2>

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Contact No</label>
          <input
            type="text"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
          />
        </div>

        <p className="forgot-password">Forgot Password?</p>

        <button className="save-changes-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {showSuccessModal && (
        <SuccessProfile onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default EditProfile;