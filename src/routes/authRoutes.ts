import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Mock user database (replace with actual database in production)
const users: { id: string; username: string; password: string; role: string }[] = [];

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: String(users.length + 1),
      username,
      password: hashedPassword,
      role
    };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token Refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify existing token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    // Generate new token
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role }, 
      JWT_SECRET, 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
