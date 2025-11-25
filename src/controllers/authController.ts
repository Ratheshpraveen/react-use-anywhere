import { Request, Response } from 'express';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
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

    res.json({
      message: 'Login successful',
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    res.json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};
