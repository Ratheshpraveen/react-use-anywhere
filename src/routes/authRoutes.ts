import express, { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import { verifyToken, refreshAccessToken } from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role: role || UserRole.USER
    });

    await newUser.save();

    // Generate tokens
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
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
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

// Token Refresh
router.post('/refresh-token', refreshAccessToken);

// Logout (invalidate tokens)
router.post('/logout', verifyToken, async (req: Request, res: Response) => {
  try {
    // Increment token version to invalidate existing tokens
    const user = await User.findByIdAndUpdate(
      req.user?.id, 
      { $inc: { tokenVersion: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Logout failed', 
      error: error.message 
    });
  }
});

export default router;
