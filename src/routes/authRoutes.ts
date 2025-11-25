import express from 'express';
import { generateToken } from '../utils/tokenUtils';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

// Mock user database (replace with actual database logic)
const users = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' },
  { id: '2', email: 'admin@example.com', password: 'admin123', role: 'admin' }
];

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user (replace with actual database lookup)
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  res.json({ token });
});

// Protected route example
router.get('/profile', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route example
router.get('/admin', authenticateJWT, requireRole(['admin']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;
