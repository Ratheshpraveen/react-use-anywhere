const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_COOKIE_OPTIONS } = require('../config/jwtConfig');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      role: user.role,
      tokenVersion: user.tokenVersion 
    }, 
    JWT_SECRET, 
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Helper function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      tokenVersion: user.tokenVersion 
    }, 
    JWT_SECRET, 
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// User Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password, role });
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send response with tokens
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is not active' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send response with tokens
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.json({ 
      accessToken,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Token Refresh Route
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check token version to prevent using old tokens
    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Token is no longer valid' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update refresh token cookie
    res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token', error: error.message });
  }
});

// Logout Route (invalidate tokens)
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // Increment token version to invalidate all existing tokens
    const user = await User.findById(req.user.id);
    if (user) {
      await user.incrementTokenVersion();
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
});

module.exports = router;
