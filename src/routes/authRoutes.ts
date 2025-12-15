import express, { Request, Response } from 'express';
import { User, UserRepository } from '../models/User';
import { verifyToken } from '../middleware/authMiddleware';
import { JWT_SECRET } from '../config/jwtConfig';

const router = express.Router();

// Validation helper function
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      roles: roles || ['user']
    });

    const savedUser = await UserRepository.save(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      userId: savedUser.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = user.generateToken();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', verifyToken, (req: Request, res: Response) => {
  // In a real-world scenario, you might want to implement token blacklisting
  res.json({ message: 'Logout successful' });
});

// Get User Profile (protected route)
router.get('/profile', verifyToken, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      roles: req.user.roles
    }
  });
});

export default router;
