const express = require('express');
const { register, login } = require('../controllers/authController');
const { authMiddleware, refreshTokenMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Token refresh route
router.post('/refresh-token', refreshTokenMiddleware);

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
