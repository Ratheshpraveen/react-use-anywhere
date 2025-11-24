import express from 'express';
import { login, register } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Access to protected route', user: req.user });
});

export default router;
