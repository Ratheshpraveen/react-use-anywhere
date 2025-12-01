const express = require('express');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Mock user database (replace with actual database in production)
const users = [];

/**
 * User registration endpoint
 */
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = User.create(email, password);
  users.push(newUser);

  res.status(201).json({ 
    message: 'User registered successfully',
    token: newUser.generateAuthToken()
  });
});

/**
 * User login endpoint
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  if (!user.verifyPassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = user.generateAuthToken();
  res.json({ token });
});

/**
 * Protected route example
 */
router.get('/profile', authenticateJWT, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

module.exports = router;
