import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken } from '../middleware/authMiddleware';

const router = express.Router();

// Mock user database (replace with actual database in production)
const users: { [key: string]: { id: string, username: string, password: string, role: string } } = {};

router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Check if user already exists
    if (users[username]) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = Date.now().toString(); // Simple unique ID generation
    users[username] = {
      id: userId,
      username,
      password: hashedPassword,
      role
    };

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users[username];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.json({
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  try {
    // In a real app, verify the refresh token against stored tokens
    const decoded = jwt.verify(refreshToken, JWT_SECRET + '_refresh') as { userId: string, role: string };

    // Generate new access token
    const newAccessToken = generateToken(decoded.userId, decoded.role);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

export default router;
