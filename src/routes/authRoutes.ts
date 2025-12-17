import express, { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Mock database (replace with actual database in production)
const users: IUser[] = [];

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await User.hashPassword(password);

    // Create new user
    const newUser: IUser = {
      id: Date.now().toString(), // Simple ID generation
      username,
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);

    // Generate token
    const token = User.generateToken(newUser);
    const refreshToken = User.generateRefreshToken(newUser);

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      refreshToken,
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        email: newUser.email, 
        role: newUser.role 
      } 
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
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const token = User.generateToken(user);
    const refreshToken = User.generateRefreshToken(user);

    res.json({ 
      message: 'Login successful', 
      token, 
      refreshToken,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error instanceof Error ? error.message : error });
  }
});

// Token Refresh
router.post('/refresh-token', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = User.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Find user
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new tokens
    const newToken = User.generateToken(user);
    const newRefreshToken = User.generateRefreshToken(user);

    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Token refresh failed', error: error instanceof Error ? error.message : error });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  // In a real-world scenario, you might want to:
  // 1. Blacklist the token
  // 2. Clear server-side session
  res.json({ message: 'Logout successful' });
});

// Protected route example
router.get('/profile', authMiddleware, roleMiddleware(['user', 'admin']), (req: Request, res: Response) => {
  res.json({ 
    message: 'Access granted', 
    user: req.user 
  });
});

export default router;
