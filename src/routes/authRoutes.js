const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// In-memory user storage (replace with database in real-world application)
const users = [];

// User Registration
router.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if user already exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create new user
  const newUser = new User(username, email, password, role);
  users.push(newUser);

  res.status(201).json({ 
    message: 'User registered successfully', 
    user: { username: newUser.username, email: newUser.email } 
  });
});

// User Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = User.authenticate(users, email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = user.generateToken();
  res.json({ token, user: { username: user.username, email: user.email, role: user.role } });
});

// Protected Route Example
router.get('/protected', 
  authMiddleware.verifyToken, 
  authMiddleware.checkRole(['admin', 'user']), 
  (req, res) => {
    res.json({ 
      message: 'Access to protected route', 
      user: req.user 
    });
});

module.exports = router;
