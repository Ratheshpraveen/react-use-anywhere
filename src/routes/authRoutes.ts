import express from 'express';
import { login, register, refreshToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);

// Protected route example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access to protected route', user: req.user });
});

export default router;
