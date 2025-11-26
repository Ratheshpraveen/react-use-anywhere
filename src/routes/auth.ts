import express, { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Mock user storage (replace with your database logic)
const users: IUser[] = [];

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ 
      id: Date.now().toString(), 
      username, 
      password 
    });

    // Hash password
    const hashedPassword = await newUser.hashPassword();
    newUser.user.password = hashedPassword;

    // Save user
    users.push(newUser.user);

    // Generate tokens
    const token = newUser.generateToken();
    const refreshToken = newUser.generateRefreshToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const userModel = new User(user);
    const isMatch = await userModel.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const token = userModel.generateToken();
    const refreshToken = userModel.generateRefreshToken();

    res.json({ token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token refresh route
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = User.verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const user = new User({
      id: decoded.id,
      username: decoded.username,
      password: '' // Not needed for token generation
    });

    const newToken = user.generateToken();

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token' });
  }
});

// Protected route example
router.get('/protected', authMiddleware, (req: Request, res: Response) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: (req as any).user 
  });
});

export default router;
