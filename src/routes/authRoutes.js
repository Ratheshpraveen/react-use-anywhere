const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Basic validation
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = new User(username, password, email);
    await user.hashPassword();

    // In a real app, you'd save the user to a database here
    // For this example, we'll just return a success message
    const token = user.generateToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // In a real app, you'd fetch the user from a database
    // For this example, we'll simulate a user
    const user = new User(username, 'hashedPassword', 'user@example.com');

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = user.generateToken();

    res.json({ 
      message: 'Login successful', 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Example of a protected route
router.get('/profile', authMiddleware.verifyToken, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

module.exports = router;
