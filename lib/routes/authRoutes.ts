import express from 'express';
import { User } from '../models/User';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Login route
 * Authenticates user and returns JWT tokens
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // In a real implementation, fetch user from database
  const mockUser = new User({
    id: 'user123',
    email: email,
    password: 'hashedPassword' // In reality, this would be a hashed password
  });

  try {
    const isValidPassword = await mockUser.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    const tokens = mockUser.generateTokens();

    res.status(200).json({
      user: mockUser.getSafeUserData(),
      ...tokens
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Login failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Logout route
 * Invalidates current tokens
 */
router.post('/logout', AuthMiddleware.authenticate, (req, res) => {
  // In a real implementation, you would:
  // 1. Blacklist current tokens
  // 2. Clear any server-side session data

  res.status(200).json({ 
    message: 'Logged out successfully' 
  });
});

/**
 * Token refresh route
 * Generates new access and refresh tokens
 */
router.post('/refresh', AuthMiddleware.refreshTokens);

export default router;
