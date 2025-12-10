import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Adjust the import path as needed

const router = express.Router();

// User Registration Route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login Route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    // Optional: Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id }, 
      process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret', 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      refreshToken,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token Refresh Route
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret'
    ) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.status(200).json({ 
      message: 'Token refreshed successfully', 
      token: newToken 
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export default router;
