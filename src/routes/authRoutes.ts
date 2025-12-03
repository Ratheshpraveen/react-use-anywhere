import express from 'express';
import { AuthService } from '../services/authService';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const userId = await AuthService.register(username, password);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const token = await AuthService.login(username, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
  }
});

// Protected route example
router.get('/profile', authenticateJWT, (req, res) => {
  // This route is protected and requires a valid JWT token
  res.json({ message: 'Access to protected route', userId: req.user.userId });
});

export default router;
