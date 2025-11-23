const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Mock user storage (replace with database in real implementation)
const users = [];

// Registration endpoint
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create new user
  const newUser = new User(username, email, password);
  users.push(newUser);

  res.status(201).json({ 
    message: 'User registered successfully',
    username: newUser.username,
    email: newUser.email 
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(u => u.email === email);
  
  if (!user || !user.comparePassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = user.generateToken();

  res.json({ 
    message: 'Login successful', 
    token 
  });
});

module.exports = router;
