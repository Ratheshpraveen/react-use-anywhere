const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Create new user
    const user = new User(username, password, email);
    
    // Hash password
    await user.hashPassword();
    
    // Save user (in a real app, this would interact with a database)
    // For this example, we'll just generate a token
    const token = user.generateToken();
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      token 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In a real app, you'd fetch the user from a database
    // For this example, we'll simulate user lookup
    const user = new User(username, password);
    
    // Check password (in a real app, you'd fetch the stored hash from DB)
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = user.generateToken();
    
    res.json({ 
      message: 'Login successful', 
      token 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

module.exports = router;
