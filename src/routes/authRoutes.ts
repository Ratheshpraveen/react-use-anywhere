import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware';

// Simulated user database (replace with actual database in production)
const users: Array<{ id: string; email: string; password: string }> = [];

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Invalid input', 
      message: 'Email and password are required' 
    });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ 
      error: 'User exists', 
      message: 'User with this email already exists' 
    });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate tokens
    const { accessToken, refreshToken } = generateToken({
      userId: newUser.id,
      email: newUser.email
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.id,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Registration failed', 
      message: 'Unable to register user' 
    });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication failed', 
      message: 'Invalid credentials' 
    });
  }

  try {
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Authentication failed', 
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateToken({
      userId: user.id,
      email: user.email
    });

    res.json({
      message: 'Login successful',
      userId: user.id,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Login failed', 
      message: 'Server error during login' 
    });
  }
});

export default router;
