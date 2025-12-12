import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Ensure you have a secure secret key - store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

// Mock user database (replace with your actual user model/database)
const users: { [key: string]: any } = {};

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    if (users[email]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    users[email] = {
      username,
      email,
      password: hashedPassword,
      role
    };

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = users[email];

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: email }, 
      REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      accessToken, 
      refreshToken,
      user: { 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token Refresh
router.post('/refresh-token', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };
    const user = users[decoded.userId];

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Protected route example
router.get('/profile', verifyToken, (req: Request, res: Response) => {
  const userId = req.user?.id;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ 
    username: user.username, 
    email: user.email, 
    role: user.role 
  });
});

export default router;
