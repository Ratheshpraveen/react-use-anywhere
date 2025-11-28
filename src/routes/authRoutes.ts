import express from 'express';
import AuthController from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
