import express from 'express';
import { User } from '../models/User';
import { tokenConfig, blacklistToken } from '../config/tokenConfig';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Mock user storage (replace with database in real implementation)
const users: User[] = [];

// Validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      roles: roles || [{ id: '2', name: 'user' }]
    });

    // Hash password
    await newUser.hashPassword();

    // Store user
    users.push(newUser);

    // Generate tokens
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error instanceof Error ? error.message : error });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error instanceof Error ? error.message : error });
  }
});

// Token Refresh
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = tokenConfig.verifyToken(refreshToken) as any;
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Find user
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    res.json({
      tokens: { 
        accessToken: newAccessToken, 
        refreshToken: newRefreshToken 
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Token refresh failed' });
  }
});

// Logout (token invalidation)
router.post('/logout', authMiddleware.verifyToken, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    // Blacklist the token
    blacklistToken(token);
  }

  res.json({ message: 'Logged out successfully' });
});

// Protected route example
router.get('/profile', authMiddleware.verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route example
router.get('/admin', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
  }
);

export default router;
