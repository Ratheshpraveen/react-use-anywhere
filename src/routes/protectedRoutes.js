const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Example of a protected route
router.get('/profile', verifyToken, (req, res) => {
  // req.user is available due to the verifyToken middleware
  res.json({
    message: 'Access to protected route successful',
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

// Another example of a protected route
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard',
    userId: req.user._id
  });
});

module.exports = router;
