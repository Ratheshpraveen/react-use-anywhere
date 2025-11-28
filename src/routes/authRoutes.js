const express = require('express');
const { login, register } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
  // req.userId is available from the middleware
  res.json({ message: 'Access to protected route', userId: req.userId });
});

module.exports = router;
