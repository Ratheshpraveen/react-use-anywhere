import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import AuthMiddleware from '../middleware/authMiddleware';
import User from '../models/User'; // Assuming you have a User model

const router = express.Router();

// User Registration Route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      name,
      passwordHash
    });

    await newUser.save();

    // Generate JWT token
    const token = AuthMiddleware.generateToken({
      userId: newUser._id.toString(),
      email: newUser.email
    });

    // Optional: Generate refresh token
    const refreshToken = AuthMiddleware.generateRefreshToken({
      userId: newUser._id.toString(),
      email: newUser.email
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
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

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = AuthMiddleware.generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    // Optional: Generate refresh token
    const refreshToken = AuthMiddleware.generateRefreshToken({
      userId: user._id.toString(),
      email: user.email
    });

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
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

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(refreshToken, secret) as { userId: string; email: string };

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new access token
    const newToken = AuthMiddleware.generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    res.json({
      token: newToken,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export default router;
