const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Mock database
let userProfile = {
  currentPassword: 'oldPassword123',
  contactNo: '1234567890',
};

// Update profile API
app.post('/api/updateProfile', (req, res) => {
  const { currentPassword, newPassword, contactNo } = req.body;

  if (currentPassword !== userProfile.currentPassword) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  // Update profile
  userProfile.currentPassword = newPassword;
  userProfile.contactNo = contactNo;

  res.status(200).json({ message: 'Profile updated successfully.' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});