import express from 'express';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../middleware/authMiddleware';
import { JWT_CONFIG, PASSWORD_SALT_ROUNDS } from '../config/jwtConfig';

const router = express.Router();

// Mock user database (replace with your actual database)
const users: any[] = [];

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

    // Create user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const payload = { 
      id: user.id, 
      email: user.email, 
      username: user.username 
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

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
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET) as any;

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Protected Route Example
router.get('/profile', verifyToken, (req, res) => {
  // @ts-ignore
  res.json({ user: req.user });
});

export default router;
