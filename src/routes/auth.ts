import express from 'express';
import { AuthUtils } from '../utils/auth';

const router = express.Router();

// Mock user database (replace with your actual database)
const users: any[] = [];

// User registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      username,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate token
    const token = AuthUtils.generateToken(newUser);

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, username: newUser.username } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// User login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await AuthUtils.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = AuthUtils.generateToken(user);

    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, username: user.username } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
