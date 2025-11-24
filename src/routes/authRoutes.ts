import express from 'express';
import { login, register, refreshToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', authMiddleware, refreshToken);

export default router;
