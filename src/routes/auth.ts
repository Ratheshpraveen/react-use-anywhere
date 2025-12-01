import express from 'express';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const router = express.Router();

// Mock user database (replace with your actual database logic)
const users: { id: string; email: string; password: string }[] = [];

// User Registration Route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
