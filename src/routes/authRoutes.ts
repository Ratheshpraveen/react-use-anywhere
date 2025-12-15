import express, { Request, Response } from 'express';
import { User, UserInterface } from '../models/User';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { verifyToken } from '../config/jwtConfig';

const router = express.Router();

// Mock user storage - replace with your database logic
const users: UserInterface[] = [];

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userData: UserInterface = { username, email, password, role };
    const user = new User(userData);
    
    // Hash password
    await user.hashPassword();

    // Save user (mock implementation)
    users.push(user.getUserData() as UserInterface);

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error instanceof Error ? error.message : error });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userData = users.find(u => u.email === email);
    if (!userData) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create user instance
    const user = new User(userData);

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({ 
      message: 'Login successful', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error instanceof Error ? error.message : error });
  }
});

// Token Refresh
router.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  const decoded = verifyToken(refreshToken);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  // Find user (mock implementation)
  const user = users.find(u => u.id === decoded.id);

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Generate new tokens
  const newAccessToken = new User(user).generateAccessToken();
  const newRefreshToken = new User(user).generateRefreshToken();

  res.json({ 
    message: 'Token refreshed successfully', 
    accessToken: newAccessToken, 
    refreshToken: newRefreshToken 
  });
});

// Logout (client-side token invalidation)
router.post('/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  // In a real-world scenario, you might want to:
  // 1. Blacklist the token
  // 2. Clear server-side session
  res.json({ message: 'Logout successful' });
});

export default router;
