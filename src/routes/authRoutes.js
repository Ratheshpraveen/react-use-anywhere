const express = require('express');
const { 
  registerUser, 
  loginUser, 
  logoutUser 
} = require('../controllers/authController');
const { 
  authMiddleware, 
  refreshTokenMiddleware 
} = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/logout', authMiddleware, logoutUser);
router.post('/refresh-token', refreshTokenMiddleware);

module.exports = router;
