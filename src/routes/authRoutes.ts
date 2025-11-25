import express from 'express';
import { 
  registerUser, 
  loginUser, 
  refreshAccessToken 
} from '../controllers/authController';
import { 
  authenticateJWT, 
  refreshTokenMiddleware 
} from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/refresh-token', refreshTokenMiddleware, refreshAccessToken);

// Example of a protected route
router.get('/profile', authenticateJWT, (req, res) => {
  // This route requires a valid JWT token
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
});

export default router;
