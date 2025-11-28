const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Create new user
    const user = new User(username, email, password);
    
    // Hash password
    await user.hashPassword();
    
    // Save user (in a real app, this would interact with a database)
    
    // Generate tokens
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      refreshToken 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user (in a real app, this would query a database)
    const user = new User('username', email, password);
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    
    res.json({ token, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Refresh token endpoint
router.post('/refresh-token', authMiddleware.refreshToken);

// Protected route example
router.get('/protected', authMiddleware.verifyToken, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

module.exports = router;
