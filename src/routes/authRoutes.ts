import express from 'express';
import { register, login, refreshUserToken } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshUserToken);

// Example of a protected route
router.get('/profile', verifyToken, (req, res) => {
  // This route requires a valid JWT token
  res.json({ 
    message: 'Access to protected route', 
    user: (req as any).user 
  });
});

export default router;
