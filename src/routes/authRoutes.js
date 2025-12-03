const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// In-memory user storage (replace with database in real-world scenario)
const users = [];

// User Registration
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = new User(username, email, password);
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// User Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const token = User.authenticate(username, password, users);

  if (token) {
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected Route Example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

module.exports = router;
