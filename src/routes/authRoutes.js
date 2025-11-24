const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Create new user
    const user = new User(username, password, email);
    
    // Hash password
    await user.hashPassword();
    
    // In a real app, you'd save to database here
    // For this example, we'll just return success
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In a real app, you'd fetch user from database
    // For this example, we'll simulate a user
    const user = new User(username, 'hashedpassword', 'user@example.com');
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = user.generateToken();
    
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protected route example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

module.exports = router;
