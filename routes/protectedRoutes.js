const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/protected/dashboard
// @desc    Example protected route
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

// @route   GET /api/protected/profile
// @desc    Another example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Welcome to your profile', 
    userDetails: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

module.exports = router;
