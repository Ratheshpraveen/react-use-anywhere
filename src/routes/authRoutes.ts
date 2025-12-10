import express from 'express';
import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ username, email, password, role });
    await newUser.save();

    // Generate tokens
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
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

    res.json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Token Refresh
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    res.status(403).json({ message: 'Invalid refresh token', error: error.message });
  }
});

// Protected Route Example
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Could not retrieve profile', error: error.message });
  }
});

export default router;
