const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

const router = express.Router();

// Assuming you have a User model - adjust the path as needed
const User = require('../models/User');

// Secret key for JWT - in a real app, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

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
      username,
      email,
      password: hashedPassword,
      role: role || 'user' // Default role if not specified
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        id: user._id 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      accessToken, 
      refreshToken,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Token Refresh Route
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token', error: error.message });
  }
});

// JWT Middleware for protected routes
const requireAuth = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256']
});

module.exports = {
  router,
  requireAuth
};
