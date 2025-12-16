const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// In-memory user storage (replace with database in production)
const users = [];

// Input validation helper
const validateInput = (input) => {
  if (!input || typeof input !== 'string' || input.trim() === '') {
    throw new Error('Invalid input');
  }
};

/**
 * User Registration Route
 */
router.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    validateInput(username);
    validateInput(email);
    validateInput(password);

    // Check if user already exists
    if (users.some(u => u.username === username || u.email === email)) {
      return res.status(400).json({ 
        error: 'User Exists', 
        message: 'Username or email already in use' 
      });
    }

    // Create new user
    const newUser = new User(username, email, password);
    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.getProfile()
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Registration Failed', 
      message: error.message 
    });
  }
});

/**
 * User Login Route
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    validateInput(username);
    validateInput(password);

    // Find user
    const user = users.find(u => u.username === username);
    
    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ 
        error: 'Authentication Failed', 
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: user.getProfile()
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Login Failed', 
      message: error.message 
    });
  }
});

/**
 * Token Refresh Route
 */
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'Refresh Token Required', 
      message: 'No refresh token provided' 
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.TOKEN_REFRESH_SECRET);
    
    // Find user
    const user = users.find(u => u.username === decoded.id);

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid Token', 
        message: 'User not found' 
      });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    res.json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(401).json({ 
      error: 'Token Refresh Failed', 
      message: 'Invalid or expired refresh token' 
    });
  }
});

/**
 * Protected Route Example
 */
router.get('/profile', verifyToken, (req, res) => {
  // Access authenticated user info from req.user
  const user = users.find(u => u.username === req.user.id);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User Not Found', 
      message: 'User profile could not be retrieved' 
    });
  }

  res.json({
    message: 'Profile retrieved successfully',
    user: user.getProfile()
  });
});

module.exports = router;
