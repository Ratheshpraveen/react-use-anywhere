import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/tokenUtils';
import User from '../models/User'; // Assuming you have a User model

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: user.id, 
      email: user.email 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user.id, 
      email: user.email 
    });

    res.json({ 
      accessToken, 
      refreshToken,
      user: { 
        id: user.id, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: newUser.id, 
      email: newUser.email 
    });
    const refreshToken = generateRefreshToken({ 
      userId: newUser.id, 
      email: newUser.email 
    });

    res.status(201).json({ 
      accessToken, 
      refreshToken,
      user: { 
        id: newUser.id, 
        email: newUser.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ 
      userId: user.id, 
      email: user.email 
    });
    const newRefreshToken = generateRefreshToken({ 
      userId: user.id, 
      email: user.email 
    });

    res.json({ 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};
