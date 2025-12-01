import express from 'express';
import { 
  registerUser, 
  loginUser, 
  refreshAccessToken 
} from '../controllers/authController';
import { 
  authMiddleware, 
  refreshTokenMiddleware 
} from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: (req as any).user });
});

// Token refresh route
router.post('/refresh-token', refreshTokenMiddleware, refreshAccessToken);

export default router;
