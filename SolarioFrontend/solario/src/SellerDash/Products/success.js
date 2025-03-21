import React from 'react';
import './successP.css';

const SuccessProfile = ({ onClose }) => {
  return (
    <div className="success-modal-overlay">
      <div className="success-modal-content">
        <h2>Profile Updated Successfully!</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SuccessProfile;