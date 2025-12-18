import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Mock user database (replace with your actual database)
const users: { id: string; email: string; password: string; role: string }[] = [];

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      email,
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

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.TOKEN_EXPIRATION || '1h';

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn }
    );

    res.json({ token, userId: user.id, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token Refresh (Optional)
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.TOKEN_EXPIRATION || '1h';

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Verify existing token
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };

    // Generate new token
    const newToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      secret,
      { expiresIn }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
