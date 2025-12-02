const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Mock user database (replace with your actual database logic)
const users = [];

// User Registration Route
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = new User(username, email, password);
  users.push(newUser);

  // Generate token
  const token = newUser.generateAuthToken();

  res.status(201).json({ 
    message: 'User registered successfully', 
    token 
  });
});

// User Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password
  if (!user.comparePassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = user.generateAuthToken();

  res.json({ 
    message: 'Login successful', 
    token 
  });
});

// Protected Route Example
router.get('/profile', authMiddleware, (req, res) => {
  // This route is now protected and requires a valid JWT token
  const user = users.find(u => u.email === req.userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ 
    username: user.username, 
    email: user.email 
  });
});

module.exports = router;
