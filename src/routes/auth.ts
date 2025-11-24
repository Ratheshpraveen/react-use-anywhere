import express, { Request, Response } from 'express';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.json({ 
      message: 'Login successful', 
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Protected route example
router.get('/profile', authMiddleware, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

export default router;
