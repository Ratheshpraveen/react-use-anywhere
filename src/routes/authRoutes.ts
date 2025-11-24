import express from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/authController';
import { authMiddleware, refreshTokenMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/refresh-token', refreshTokenMiddleware, refreshToken);

export default router;
