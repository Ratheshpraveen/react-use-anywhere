const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  // This route requires a valid JWT token
  res.json({ message: 'Access to protected route', user: req.user });
});

module.exports = router;
