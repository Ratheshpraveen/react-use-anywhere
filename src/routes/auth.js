const express = require('express');
const { generateToken } = require('../utils/tokenUtils');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Mock user database (replace with your actual user authentication logic)
const users = [
  { id: 1, username: 'testuser', password: 'password123' }
];

/**
 * User login route
 * Generates and returns a JWT token upon successful authentication
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace this with your actual user authentication logic
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = generateToken({ 
    id: user.id, 
    username: user.username 
  });

  res.json({ 
    message: 'Login successful', 
    token 
  });
});

/**
 * Protected route example
 * Demonstrates using JWT authentication middleware
 */
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
});

module.exports = router;
