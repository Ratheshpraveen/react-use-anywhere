import express, { Request, Response } from 'express';
import User from '../models/User';
import JwtService from '../../lib/services/jwtService';
import AuthMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password, role });
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = user.generateAuthTokens();

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = user.generateAuthTokens();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token Refresh
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const decoded = JwtService.verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  // Find user and generate new tokens
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    return res.status(403).json({ error: 'User not found' });
  }

  const { 
    accessToken: newAccessToken, 
    refreshToken: newRefreshToken 
  } = user.generateAuthTokens();

  res.json({ 
    accessToken: newAccessToken, 
    refreshToken: newRefreshToken 
  });
});

// Logout (client-side token invalidation)
router.post('/logout', AuthMiddleware.authenticateToken, (req: Request, res: Response) => {
  // In a stateless JWT system, logout is typically handled client-side
  // by removing the tokens. Here we just send a success response.
  res.json({ message: 'Logged out successfully' });
});

export default router;
