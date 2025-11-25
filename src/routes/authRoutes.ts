import express, { Request, Response } from 'express';
import TokenUtils from '../utils/tokenUtils';
import AuthMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Mock user database (replace with actual database in real implementation)
const users = [
  { id: '1', email: 'user@example.com', password: 'password123' }
];

/**
 * Login route to generate JWT tokens
 */
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Mock authentication (replace with actual authentication logic)
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = TokenUtils.generateAccessToken({ 
    userId: user.id, 
    email: user.email 
  });
  const refreshToken = TokenUtils.generateRefreshToken({ 
    userId: user.id, 
    email: user.email 
  });

  res.json({ 
    accessToken, 
    refreshToken 
  });
});

/**
 * Token refresh route
 */
router.post('/refresh-token', AuthMiddleware.refreshToken);

/**
 * Protected route example
 */
router.get('/protected', AuthMiddleware.authenticateToken, (req: Request, res: Response) => {
  res.json({ 
    message: 'Access to protected route granted', 
    user: req.user 
  });
});

export default router;
