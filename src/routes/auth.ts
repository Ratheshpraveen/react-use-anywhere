import express, { Request, Response } from 'express';
import { UserModel, User } from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Mock user storage (replace with your actual user storage mechanism)
const users: User[] = [];

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await UserModel.hashPassword(password);

    // Create user
    const newUser: User = {
      id: String(users.length + 1),
      username,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate tokens
    const token = UserModel.generateToken(newUser);
    const refreshToken = UserModel.generateRefreshToken(newUser);

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const token = UserModel.generateToken(user);
    const refreshToken = UserModel.generateRefreshToken(user);

    res.json({ token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token refresh route
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = UserModel.verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newToken = UserModel.generateToken({ 
      id: decoded.id, 
      username: decoded.username 
    });

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token' });
  }
});

// Protected route example
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ message: 'Access to protected route', user });
});

export default router;
