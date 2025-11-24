const express = require('express');
const router = express.Router();
const { login, protectedRoute } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Login route
router.post('/login', login);

// Protected route example
router.get('/protected', authMiddleware, protectedRoute);

module.exports = router;
