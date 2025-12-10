const express = require('express');
const bcrypt = require('bcryptjs');
const TokenService = require('../services/tokenService');
const User = require('../models/User'); // Assuming you have a User model
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength validation
const isStrongPassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password) && 
         /[!@#$%^&*()]/.test(password);
};

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(newUser);
    const refreshToken = TokenService.generateRefreshToken(newUser);

    // Update user with refresh token
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user);
    const refreshToken = TokenService.generateRefreshToken(user);

    // Update user's refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Token Refresh
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = TokenService.verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Find user
    const user = await User.findOne({ 
      email: decoded.email, 
      refreshToken 
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = TokenService.generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
