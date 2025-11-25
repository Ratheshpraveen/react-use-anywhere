import express from 'express';
import { 
  registerUser, 
  loginUser, 
  refreshAccessToken 
} from '../controllers/authController';
import { 
  authenticateToken, 
  refreshTokenMiddleware 
} from '../middleware/authMiddleware';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
});

// Public routes with rate limiting
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

// Protected routes
router.post('/refresh-token', refreshTokenMiddleware, refreshAccessToken);

// Example of a protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
