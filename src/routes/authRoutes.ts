import express, { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      roles: roles || ['user']
    });

    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error instanceof Error ? error.message : error });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user by username
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
        roles: user.roles 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error instanceof Error ? error.message : error });
  }
});

// User Logout (client-side token invalidation)
router.post('/logout', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  // In a JWT system, logout is typically handled client-side by removing the token
  res.json({ message: 'Logout successful' });
});

// Get User Profile (protected route example)
router.get('/profile', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error instanceof Error ? error.message : error });
  }
});

export default router;
