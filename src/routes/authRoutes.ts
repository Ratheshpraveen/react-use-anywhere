import express, { Request, Response } from 'express';
import { generateToken, refreshToken } from '../middleware/authMiddleware';
import { User, UserRole } from '../models/User';

// In-memory user storage (replace with database in production)
const users: User[] = [];

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      id: Date.now().toString(),
      username,
      email,
      password,
      role: role in UserRole ? role as keyof UserRole : 'user'
    });

    // Hash password before saving
    newUser.password = await newUser.hashPassword();

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: newUser.toJSON()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({ 
      message: 'Login successful', 
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Token Refresh
router.post('/refresh-token', (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const newToken = refreshToken(token);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid token', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;
