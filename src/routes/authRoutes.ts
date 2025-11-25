import express from 'express';
import { register, login, refreshToken } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Example of a protected route
router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
