const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Mock user storage (replace with database in real implementation)
const users = [];

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = new User(username, email, password);
  users.push(newUser);

  const token = newUser.generateAuthToken();
  res.status(201).json({ token, user: { username, email } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user || !user.comparePassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = user.generateAuthToken();
  res.json({ token, user: { username: user.username, email } });
});

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.email === req.user.userId);
  res.json({ user: { username: user.username, email: user.email } });
});

module.exports = router;
