const express = require('express');
const { 
  register, 
  login, 
  refreshTokens, 
  logout 
} = require('../controllers/authController');
const { 
  authMiddleware, 
  optionalAuthMiddleware 
} = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshTokens);

// Protected routes
router.post('/logout', authMiddleware, logout);

// Example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
});

// Example of an optional auth route
router.get('/public-data', optionalAuthMiddleware, (req, res) => {
  if (req.user) {
    res.json({ 
      message: 'Data with optional authentication', 
      user: req.user 
    });
  } else {
    res.json({ 
      message: 'Public data without authentication' 
    });
  }
});

module.exports = router;
