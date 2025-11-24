import express from 'express';
import { register, login, refreshToken } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', authenticateJWT, refreshToken);

export default router;
