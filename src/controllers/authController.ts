import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  blacklistToken 
} from '../middleware/authMiddleware';

// Centralized error handling
const handleError = (res: Response, error: any, defaultMessage = 'Server error') => {
  console.error(error);
  res.status(error.statusCode || 500).json({ 
    error: error.message || defaultMessage 
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({ 
      message: 'Login successful', 
      accessToken, 
      refreshToken 
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: string };
    
    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.userId);

    res.json({ accessToken: newAccessToken });
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    handleError(res, error, 'Invalid refresh token');
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Get token from request
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      // Blacklist the current token
      blacklistToken(token);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    handleError(res, error);
  }
};
