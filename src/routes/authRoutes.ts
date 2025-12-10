import express, { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { authenticateJWT } from '../middleware/authMiddleware';
import { JWT_CONFIG } from '../config/jwtConfig';
import jwt from 'jsonwebtoken';

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists' 
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      roles: roles || ['user']
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
        roles: newUser.roles
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Registration failed' 
    });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
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
        roles: user.roles
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Login failed' 
    });
  }
});

// Token Refresh
router.post('/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'Refresh token required' 
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid refresh token' 
      });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(403).json({ 
      error: 'Invalid refresh token' 
    });
  }
});

// Protected Route Example
router.get('/profile', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      error: 'Could not retrieve profile' 
    });
  }
});

export default router;
