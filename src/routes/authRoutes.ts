import express, { Request, Response } from 'express';
import { User, UserInterface } from '../models/User';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// In-memory user storage (replace with database in production)
const users: User[] = [];

// Validation middleware
const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

// User Registration
router.post('/register', validateRegistration, async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ username, email, password, role });
    await newUser.hashPassword();
    users.push(newUser);

    // Generate token
    const token = newUser.generateToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: newUser.toJSON(),
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateToken();

    res.json({ 
      message: 'Login successful', 
      user: user.toJSON(),
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Protected route example
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

export default router;
