import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Example of a protected route
router.get('/protected', protectedRoute, (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    userId: req.userId 
  });
});

export default router;
