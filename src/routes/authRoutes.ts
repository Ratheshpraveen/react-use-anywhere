import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Assuming User model exists
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Ensure this is a secure, environment-specific secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key_change_in_production';

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

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error instanceof Error ? error.message : error });
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

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      userId: user._id,
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error instanceof Error ? error.message : error });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', verifyToken, (req: Request, res: Response) => {
  // Note: Actual logout is typically handled client-side by removing the token
  res.json({ message: 'Logout successful' });
});

// Get current user profile (protected route)
router.get('/profile', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error instanceof Error ? error.message : error });
  }
});

export default router;
