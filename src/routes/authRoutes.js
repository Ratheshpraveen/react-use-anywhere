const express = require('express');
const User = require('../models/User');
const { verifyToken, handleAuthError } = require('../middleware/authMiddleware');

const router = express.Router();

// In-memory user store (replace with database in production)
const users = [];

// Validation helper function
const validateInput = (username, email, password) => {
  const errors = [];
  if (!username || username.length < 3) errors.push('Username must be at least 3 characters');
  if (!email || !email.includes('@')) errors.push('Invalid email');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

// User Registration
router.post('/register', (req, res) => {
  const { username, email, password, roles } = req.body;
  
  // Validate input
  const validationErrors = validateInput(username, email, password);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  // Check if user already exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = User.create(username, email, password, roles);
  users.push(newUser);

  res.status(201).json({ 
    message: 'User registered successfully',
    username: newUser.username,
    email: newUser.email 
  });
});

// User Login
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
  const token = user.generateToken();

  res.json({ 
    message: 'Login successful', 
    token,
    username: user.username,
    email: user.email 
  });
});

// Logout (client-side token invalidation)
router.post('/logout', verifyToken, (req, res) => {
  // In a real-world scenario, you might want to implement token blacklisting
  res.json({ message: 'Logout successful' });
});

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: req.auth 
  });
});

// Error handling middleware
router.use(handleAuthError);

module.exports = router;
