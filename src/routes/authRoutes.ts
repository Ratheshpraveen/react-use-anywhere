import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Assuming you have a User model

const router = express.Router();

// JWT Secret - in a real-world scenario, this should be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

// Token generation utility
const generateTokens = (user: any) => {
  // Access token (short-lived)
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '15m' }
  );

  // Refresh token (long-lived)
  const refreshToken = jwt.sign(
    { 
      id: user.id 
    }, 
    REFRESH_SECRET, 
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// User Registration Route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'user' // Default role if not specified
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      tokens: { accessToken, refreshToken }
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: 'Login successful',
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      tokens: { accessToken, refreshToken }
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
    const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new tokens
    const { 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    } = generateTokens(user);

    res.json({
      message: 'Tokens refreshed successfully',
      tokens: { 
        accessToken: newAccessToken, 
        refreshToken: newRefreshToken 
      }
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export default router;
