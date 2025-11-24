import express from 'express';
import { generateToken } from '../utils/tokenUtils';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

// Mock user authentication (replace with actual database lookup)
const mockUserAuthentication = (email: string, password: string) => {
  // In a real app, this would check against a database
  if (email === 'user@example.com' && password === 'password123') {
    return {
      userId: '123',
      email: 'user@example.com',
      role: 'user',
    };
  }
  return null;
};

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = mockUserAuthentication(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user.userId,
      email: user.email,
      role: user.role,
    },
  });
});

// Example of a protected route
router.get('/profile', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// Example of a role-based protected route
router.get('/admin', authenticateJWT, requireRole(['admin']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;
