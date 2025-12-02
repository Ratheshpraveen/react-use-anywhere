import express from 'express';
import { generateToken, authenticateJWT } from '../auth/jwt';

const router = express.Router();

// Mock user database (replace with your actual user management)
const users = [
  { id: '1', email: 'user@example.com', password: 'password123' }
];

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user (replace with actual database lookup)
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected route example
router.get('/profile', authenticateJWT, (req, res) => {
  // req.user is available after JWT authentication
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

export default router;
