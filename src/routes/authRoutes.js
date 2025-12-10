const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { 
  generateToken, 
  protectRoute, 
  logAuthEvent 
} = require('../middleware/authMiddleware');

/**
 * User Registration Route
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      logAuthEvent('REGISTRATION_ERROR', `Registration attempt with existing email/username: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ 
      username, 
      email, 
      password,
      role: role || 'user' 
    });

    await user.save();

    logAuthEvent('REGISTRATION_SUCCESS', `User registered: ${email}`);

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user._id 
    });
  } catch (error) {
    logAuthEvent('REGISTRATION_ERROR', `Registration failed: ${error.message}`);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

/**
 * User Login Route
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      logAuthEvent('LOGIN_FAILED', `Login attempt with non-existent email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      logAuthEvent('LOGIN_FAILED', `Incorrect password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    logAuthEvent('LOGIN_SUCCESS', `User logged in: ${email}`);

    res.json({ 
      token, 
      userId: user._id,
      role: user.role 
    });
  } catch (error) {
    logAuthEvent('LOGIN_ERROR', `Login error: ${error.message}`);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

/**
 * Protected Route Example
 */
router.get('/profile', protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
