import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Assuming you have a User model
import { authenticateJWT, refreshToken } from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

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
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Generate tokens
    const accessToken = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.REFRESH_TOKEN_SECRET || '',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET || '',
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login successful', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

// Token Refresh Route
router.post('/refresh-token', refreshToken);

// Protected Route Example
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    // Fetch user profile (excluding sensitive information)
    const user = await User.findById(req.user?.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch profile', error });
  }
});

export default router;
