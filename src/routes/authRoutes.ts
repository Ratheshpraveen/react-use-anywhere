import express, { Request, Response } from 'express';
import User from '../models/User';
import AuthMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if user already exists (in a real app, you'd check against a database)
    // const existingUser = await findUserByEmail(email);
    // if (existingUser) {
    //   return res.status(409).json({ message: 'User already exists' });
    // }

    // Create new user
    const user = new User({ username, email, password });
    
    // Hash password
    user.password = await user.hashPassword();

    // Save user (in a real app, you'd save to a database)
    // await saveUser(user);

    // Generate tokens
    const { accessToken, refreshToken } = user.generateTokens();

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // In a real app, you'd fetch user from database
    // const user = await findUserByEmail(email);
    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

    // Mock user for demonstration
    const user = new User({ id: 'mock-user-id', username: 'testuser', email, password });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = user.generateTokens();

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: (error as Error).message });
  }
});

// Token Refresh
router.post('/refresh-token', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  const newAccessToken = AuthMiddleware.refreshToken(refreshToken);

  if (!newAccessToken) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  res.json({ accessToken: newAccessToken });
});

// Logout (client-side token invalidation)
router.post('/logout', (req: Request, res: Response) => {
  // In a real app, you might want to:
  // 1. Blacklist the token
  // 2. Clear server-side session
  // 3. Invalidate refresh tokens

  res.json({ message: 'Logout successful' });
});

// Protected route example
router.get('/profile', AuthMiddleware.verifyToken, (req: Request, res: Response) => {
  // Access authenticated user info via (req as any).user
  res.json({ message: 'Access to protected route', user: (req as any).user });
});

export default router;
