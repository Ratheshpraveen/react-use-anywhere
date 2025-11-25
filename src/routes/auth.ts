import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Registration Route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user.id 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const token = await User.authenticate(email, password);

    if (!token) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Protected Route Example
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  // This route is protected and requires a valid JWT token
  res.json({ 
    message: 'Access to protected route', 
    user: (req as any).user 
  });
});

export default router;
