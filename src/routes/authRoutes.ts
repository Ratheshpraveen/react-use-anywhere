import express from 'express';
import { register, login, refreshToken } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Example of a protected route
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

export default router;
