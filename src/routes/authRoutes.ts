import express, { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { verifyToken, refreshTokenMiddleware } from '../middleware/authMiddleware';
import { JWT_CONFIG } from '../config/jwtConfig';

const router = express.Router();

// Validation helper function
const validateRegistrationInput = (username: string, email: string, password: string) => {
  const errors: string[] = [];

  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return errors;
};

// User Registration Route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles } = req.body;

    // Validate input
    const validationErrors = validateRegistrationInput(username, email, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

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
      roles: roles || ['user']
    });

    // Save user
    await newUser.save();

    // Generate tokens
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login Route
router.post('/login', async (req: Request, res: Response) => {
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

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token Refresh Route
router.post('/refresh-token', refreshTokenMiddleware, async (req: Request, res: Response) => {
  try {
    // Find user by ID from refresh token
    const user = await User.findById(req.user?.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    res.json({
      message: 'Tokens refreshed successfully',
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});

// Protected Route Example
router.get('/profile', verifyToken, async (req: Request, res: Response) => {
  try {
    // Find user, excluding password
    const user = await User.findById(req.user?.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

export default router;
