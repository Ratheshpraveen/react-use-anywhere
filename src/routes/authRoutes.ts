import express, { Request, Response } from 'express';
import { generateToken } from '../middleware/authMiddleware';
import User from '../models/User';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (replace with proper password verification)
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email
    });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ email, password });
    await newUser.save();

    // Generate JWT token
    const token = generateToken({
      id: newUser._id,
      email: newUser.email
    });

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser._id, 
        email: newUser.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
