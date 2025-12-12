import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { refreshToken } from '../middleware/authMiddleware';

// Simulated user model (you'll replace this with your actual user model)
interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

// Simulated user database (replace with actual database)
const users: User[] = [];

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'user' } = req.body;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password: hashedPassword,
      role
    };
    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRATION }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error });
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

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error });
  }
});

// Token Refresh
router.post('/refresh-token', (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify existing token (without expiration check)
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as any;

    // Generate new token
    const newToken = refreshToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
