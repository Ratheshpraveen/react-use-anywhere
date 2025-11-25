const express = require('express');
const { generateToken } = require('../utils/tokenUtils');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Mock user database (replace with actual user authentication)
const users = [
  { id: 1, username: 'testuser', password: 'password123' }
];

/**
 * Login route to generate JWT token
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user (replace with actual database lookup)
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = generateToken({ id: user.id, username: user.username });
  
  res.json({ token });
});

/**
 * Protected route example
 */
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

module.exports = router;
