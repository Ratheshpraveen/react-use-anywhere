const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Example of a route protected for all authenticated users
router.get('/user-profile', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Access granted to user profile', 
    user: req.user 
  });
});

// Example of a route protected for admin users only
router.get('/admin-dashboard', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  (req, res) => {
    res.json({ 
      message: 'Welcome to admin dashboard' 
    });
  }
);

module.exports = router;
