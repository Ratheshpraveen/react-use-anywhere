import express, { Request, Response } from 'express';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { User } from '../models/User'; // Assuming you have a User model

const router = express.Router();

// Input validation helper
const validateInput = (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Password strength check (example: min 8 characters)
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
};

/**
 * User Registration Route
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    validateInput(email, password);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name
    });

    // Save user
    await newUser.save();

    // Generate token
    const token = generateToken({ 
      id: newUser._id, 
      email: newUser.email 
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { 
        id: newUser._id, 
        email: newUser.email, 
        name: newUser.name 
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ 
      message: errorMessage 
    });
  }
});

/**
 * User Login Route
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    validateInput(email, password);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email 
    });

    res.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    res.status(400).json({ 
      message: errorMessage 
    });
  }
});

/**
 * Token Refresh Route
 */
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Validate existing token (you might want to add more sophisticated refresh token logic)
    if (!token) {
      return res.status(400).json({ 
        message: 'Refresh token is required' 
      });
    }

    // In a real-world scenario, you'd validate the refresh token against stored tokens
    // For this example, we'll just generate a new token

    // Decode the existing token to get user info
    const decoded = await verifyToken(token);

    // Generate a new token
    const newToken = generateToken({ 
      id: decoded.id, 
      email: decoded.email 
    });

    res.json({ 
      message: 'Token refreshed successfully',
      token: newToken 
    });
  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid refresh token' 
    });
  }
});

export default router;
