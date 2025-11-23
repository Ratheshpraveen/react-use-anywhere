import express from 'express';
import { register, login, refreshToken } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', requireAuth, refreshToken);

export default router;
