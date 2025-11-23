import express from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', authMiddleware, refreshToken);

export default router;
