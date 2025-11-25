import express from 'express';
import { register, login, refreshToken } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Example of a protected route
router.get('/profile', authenticateJWT, (req, res) => {
  res.json({ message: 'Access to protected route', user: req.user });
});

export default router;
