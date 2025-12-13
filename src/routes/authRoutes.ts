import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware';
import User from '../models/User'; // Adjust the import path as needed

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Generate token
    const token = generateToken({ 
      id: newUser._id, 
      email: newUser.email, 
      role: newUser.role 
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    res.json({ 
      message: 'Login successful', 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
});

// Token Refresh
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify existing token and generate a new one
    // You might want to add more sophisticated token refresh logic
    const decoded = generateToken(token);

    res.json({ token: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
