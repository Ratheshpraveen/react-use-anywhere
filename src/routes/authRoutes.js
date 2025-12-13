const express = require('express');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken, refreshAccessToken } = require('../utils/tokenUtils');
const router = express.Router();

// Mock user database (replace with your actual database logic)
const users = [];

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength validation
const isStrongPassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password) && 
         /[!@#$%^&*]/.test(password);
};

// User Registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate email
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password strength
  if (!isStrongPassword(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' 
    });
  }

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = { 
    id: users.length + 1, 
    email, 
    password: hashedPassword 
  };
  users.push(newUser);

  // Generate tokens
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  res.status(201).json({ 
    message: 'User registered successfully', 
    accessToken, 
    refreshToken 
  });
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ 
    message: 'Login successful', 
    accessToken, 
    refreshToken 
  });
});

// Token Refresh
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const newAccessToken = refreshAccessToken(refreshToken);

  if (!newAccessToken) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  res.json({ accessToken: newAccessToken });
});

module.exports = router;
