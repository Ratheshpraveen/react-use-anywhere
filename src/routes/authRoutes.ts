import { Router, Request, Response } from 'express';
import User from '../models/User';
import { authMiddleware, refreshTokenMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Mock user storage (replace with actual database in production)
const users: User[] = [];

// Registration endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.hashPassword();
    users.push(newUser);

    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({ 
      message: 'Login successful', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token refresh endpoint
router.post('/refresh-token', refreshTokenMiddleware);

// Protected route example
router.get('/protected', authMiddleware, (req: Request, res: Response) => {
  res.json({ 
    message: 'Access to protected route', 
    user: (req as any).user 
  });
});

export default router;
