const express = require('express');
const { register, login } = require('../controllers/authController');
const protectedRoute = require('../middleware/protectedRouteMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Example of a protected route
router.get('/profile', protectedRoute, (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
});

module.exports = router;
