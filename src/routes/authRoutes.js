const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Mock user database (replace with your actual user management)
const users = [];

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };
    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser.id,
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({ 
      message: 'Login successful', 
      userId: user.id,
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  // req.userId is set by authMiddleware
  const user = users.find(u => u.id === req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ 
    message: 'Protected route accessed successfully',
    user: { 
      id: user.id, 
      username: user.username 
    } 
  });
});

module.exports = router;
