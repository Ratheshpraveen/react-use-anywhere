const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { refreshToken } = require('../middleware/authMiddleware');

const router = express.Router();

// User Registration
router.post(
  '/register', 
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, role = 'user' } = req.body;

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
        password: hashedPassword,
        role
      });

      await newUser.save();

      // Generate tokens
      const accessToken = jwt.sign(
        { id: newUser._id, role: newUser.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      const refreshTokenValue = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Update user with refresh token
      newUser.refreshToken = refreshTokenValue;
      await newUser.save();

      res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        refreshToken: refreshTokenValue
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// User Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      const refreshTokenValue = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Update user's refresh token
      user.refreshToken = refreshTokenValue;
      await user.save();

      res.json({
        message: 'Login successful',
        accessToken,
        refreshToken: refreshTokenValue
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Token Refresh
router.post('/refresh-token', refreshToken, async (req, res) => {
  try {
    res.json({
      message: 'Token refreshed successfully',
      accessToken: req.newAccessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout (invalidate refresh token)
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });
    
    if (user) {
      // Clear refresh token
      user.refreshToken = null;
      await user.save();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
