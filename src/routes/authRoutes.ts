import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import JWTService from '../../lib/services/jwtService';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware';
import UserModel from '../models/UserModel'; // Assume this exists

const router = express.Router();

// User registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, email, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser._id 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// User login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = JWTService.generateAccessToken(user._id, user.role);
    const refreshToken = JWTService.generateRefreshToken(user._id, user.role);

    res.json({ 
      accessToken, 
      refreshToken,
      user: { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Login failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Token refresh
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = JWTService.verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Find user
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Blacklist old refresh token
    await JWTService.blacklistToken(decoded.tokenId, decoded.userId);

    // Generate new tokens
    const newAccessToken = JWTService.generateAccessToken(user._id, user.role);
    const newRefreshToken = JWTService.generateRefreshToken(user._id, user.role);

    res.json({ 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Token refresh failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Logout (revoke tokens)
router.post('/logout', authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Blacklist current token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      const decoded = JWTService.verifyAccessToken(token);
      if (decoded) {
        await JWTService.blacklistToken(decoded.tokenId, decoded.userId);
      }
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Logout failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Protected route example
router.get('/admin', 
  authenticateJWT, 
  authorizeRole(['admin']), 
  (req: Request, res: Response) => {
    res.json({ message: 'Admin access granted' });
  }
);

export default router;
