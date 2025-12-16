const express = require('express');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed

const router = express.Router();

// Secret key for JWT - in a real-world scenario, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
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

    // Generate JWT token
    const token = jsonwebtoken.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        email: newUser.email, 
        role: newUser.role 
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jsonwebtoken.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshToken = jsonwebtoken.sign(
      { 
        id: user._id 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      refreshToken,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Token Refresh Route
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jsonwebtoken.verify(refreshToken, JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newToken = jsonwebtoken.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
