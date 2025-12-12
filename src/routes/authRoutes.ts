import express from 'express';
import bcrypt from 'bcryptjs';
import { tokenUtils } from '../utils/tokenUtils';
import { User } from '../models/User'; // Assume this exists

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
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
    const accessToken = tokenUtils.generateAccessToken(newUser._id, newUser.role);
    const refreshToken = tokenUtils.generateRefreshToken(newUser._id, newUser.role);

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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = tokenUtils.generateAccessToken(user._id, user.role);
    const refreshToken = tokenUtils.generateRefreshToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token Refresh
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  const newTokens = tokenUtils.refreshToken(refreshToken);

  if (!newTokens) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  res.json(newTokens);
});

// Logout (Blacklist current token)
router.post('/logout', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (token) {
    tokenUtils.blacklistToken(token);
  }

  res.json({ message: 'Logged out successfully' });
});

export default router;
