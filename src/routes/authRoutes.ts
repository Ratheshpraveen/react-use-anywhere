import express from 'express';
import { User, IUser } from '../models/User';
import { UserRoles } from '../config/jwtConfig';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Mock user storage (replace with database in real implementation)
const users: IUser[] = [];

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = UserRoles.USER } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create user
    const userData: IUser = { username, email, password, role };
    const user = new User(userData);
    
    // Hash password
    userData.password = await user.hashPassword();
    
    // Save user
    users.push(userData);

    // Generate token
    const token = user.generateToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { username, email, role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userData = users.find(u => u.email === email);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create user instance
    const user = new User(userData);

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateToken();

    res.json({ 
      message: 'Login successful', 
      token,
      user: { 
        username: userData.username, 
        email: userData.email, 
        role: userData.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Protected route example
router.get('/profile', 
  authMiddleware.verifyToken, 
  authMiddleware.requireRole([UserRoles.USER, UserRoles.ADMIN]), 
  (req, res) => {
    res.json({ 
      message: 'Access granted', 
      user: req.user 
    });
  }
);

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  // In JWT, logout is typically handled client-side by removing the token
  res.json({ message: 'Logout successful' });
});

export default router;
