const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/refresh-token', authMiddleware, refreshToken);

module.exports = router;
