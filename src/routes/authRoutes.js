const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
});

module.exports = router;
