import express from 'express';
import User from '../models/User';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    await newUser.save();

    // Generate token
    const token = newUser.generateAuthToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.json({ 
      message: 'Login successful', 
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateJWT, (req, res) => {
  // In JWT, logout is typically handled client-side by removing the token
  res.json({ message: 'Logout successful' });
});

// Protected route example
router.get('/profile', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route example
router.get('/admin', authenticateJWT, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

export default router;
