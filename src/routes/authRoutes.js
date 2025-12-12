const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');
const User = require('../models/User'); // Assuming you have a User model

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

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
      email,
      password: hashedPassword,
      role: role || 'user' // Default role if not specified
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: newUser._id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
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
    const token = generateToken(user);

    res.json({ 
      token, 
      userId: user._id,
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Token Refresh Route (Optional)
router.post('/refresh-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify existing token and generate a new one
    // This is a simplified version - in a real app, you'd want more robust token refresh logic
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const newToken = generateToken(user);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Token refresh failed', details: error.message });
  }
});

module.exports = router;
