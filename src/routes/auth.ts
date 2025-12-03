import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Mock user database (replace with your actual database logic)
const users: { [key: string]: { id: number, username: string, password: string } } = {};

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    if (users[username]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: Object.keys(users).length + 1,
      username,
      password: hashedPassword
    };

    users[username] = newUser;

    // Generate token
    const token = generateToken({ id: newUser.id, username });

    res.status(201).json({ token, user: { id: newUser.id, username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = users[username];
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: user.id, username });

    res.json({ token, user: { id: user.id, username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Protected route example
router.get('/protected', authMiddleware, (req: Request, res: Response) => {
  res.json({ 
    message: 'This is a protected route', 
    user: (req as any).user 
  });
});

export default router;
