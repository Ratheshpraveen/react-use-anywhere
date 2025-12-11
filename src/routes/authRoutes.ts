import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Mock user database - replace with your actual database
const users: any[] = [];

// JWT Secret - In a real-world scenario, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'user' } = req.body;

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ 
        error: 'User already exists', 
        message: 'An account with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser.id 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Registration failed', 
      message: 'Unable to register user' 
    });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication failed', 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Authentication failed', 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      userId: user.id, 
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Login failed', 
      message: 'Unable to log in' 
    });
  }
});

// Protected Route Example
router.get('/profile', verifyToken, (req: Request, res: Response) => {
  // Access authenticated user via req.user
  res.json({ 
    message: 'Access granted', 
    user: req.user 
  });
});

export default router;
