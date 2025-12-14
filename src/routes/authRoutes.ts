import express, { Request, Response } from 'express';
import User from '../models/User';
import { authenticateToken, refreshTokenMiddleware } from '../middleware/authMiddleware';

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
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      roles: roles || ['user']
    });

    // Save the user
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
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error.message 
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
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
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
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Login failed', 
      details: error.message 
    });
  }
});

// Token Refresh
router.post('/refresh-token', refreshTokenMiddleware, (req: Request, res: Response) => {
  try {
    // In a real-world scenario, you'd fetch the user from the database
    // For this example, we'll assume the user is already in req.user from the middleware
    const user = req.user;

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        roles: user.roles 
      }, 
      JWT_CONFIG.SECRET, 
      { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id }, 
      JWT_CONFIG.SECRET, 
      { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY }
    );

    res.json({
      message: 'Tokens refreshed successfully',
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Token refresh failed', 
      details: error.message 
    });
  }
});

// Logout (optional - typically handled client-side by removing tokens)
router.post('/logout', authenticateToken, (req: Request, res: Response) => {
  // In a more robust implementation, you might:
  // 1. Blacklist the current token
  // 2. Invalidate refresh tokens
  // 3. Perform additional cleanup

  res.json({ message: 'Logout successful' });
});

export default router;
