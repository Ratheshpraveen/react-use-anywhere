import express from 'express';
import { register, login, refreshToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', authMiddleware, refreshToken);

export default router;
