const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
});

module.exports = router;
