import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Registration Route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.create(email, password);
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user.id 
    });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Registration failed' 
    });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const token = await User.authenticate(email, password);
    
    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ token });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Login failed' 
    });
  }
});

// Protected Route Example
router.get('/profile', authenticateJWT, (req: Request, res: Response) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

export default router;
