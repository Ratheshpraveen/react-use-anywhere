import express, { Request, Response } from 'express';
import { generateToken, verifyToken, refreshToken } from '../middleware/jwtAuth';

const router = express.Router();

// Mock user database (replace with your actual user authentication logic)
const users = [
  { id: '1', email: 'user@example.com', password: 'password123' }
];

// Login route
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user (replace with actual database lookup)
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email
  });

  res.json({ 
    token, 
    user: { 
      id: user.id, 
      email: user.email 
    } 
  });
});

// Token refresh route (protected route)
router.post('/refresh-token', verifyToken, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const newToken = refreshToken(token);

  if (!newToken) {
    return res.status(401).json({ error: 'Unable to refresh token' });
  }

  res.json({ token: newToken });
});

// Logout route (client-side token invalidation)
router.post('/logout', verifyToken, (req: Request, res: Response) => {
  // In a real-world scenario, you might want to:
  // 1. Blacklist the token
  // 2. Clear any server-side session
  res.json({ message: 'Logged out successfully' });
});

export default router;
