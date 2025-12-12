import express, { Request, Response } from 'express';
import { User, UserInterface } from '../models/User';
import { jwtConfig } from '../config/jwtConfig';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input (add more robust validation in a real app)
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Username, email, and password are required' 
      });
    }

    // Check if user already exists (mock implementation)
    // In a real app, you'd check against a database
    const userData: UserInterface = {
      username,
      email,
      password,
      role: role || 'user'
    };

    const newUser = await User.create(userData);
    
    // Generate authentication token
    const token = User.generateAuthToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: 'An error occurred during registration' 
    });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Mock user lookup (replace with actual database query)
    const mockUser: UserInterface = {
      id: 'mock-user-id',
      username: 'testuser',
      email: 'test@example.com',
      password: await User.hashPassword('testpassword'), // Hashed password
      role: 'user'
    };

    // Check credentials
    const isValidPassword = await User.comparePassword(password, mockUser.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid credentials' 
      });
    }

    // Generate authentication token
    const token = User.generateAuthToken(mockUser);

    res.json({
      message: 'Login successful',
      user: {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: 'An error occurred during login' 
    });
  }
});

// Token Refresh (example implementation)
router.post('/refresh-token', authMiddleware.verifyToken, (req: Request, res: Response) => {
  const user = (req as any).user;

  // In a real app, you might want to implement additional checks
  // such as checking if the current token is close to expiration
  const newToken = jwtConfig.generateToken({
    userId: user.userId,
    email: user.email,
    role: user.role
  });

  res.json({
    message: 'Token refreshed successfully',
    token: newToken
  });
});

// Protected Route Example
router.get('/profile', 
  authMiddleware.verifyToken, 
  authMiddleware.checkRole(['user', 'admin']), 
  (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({
      message: 'Access to protected route',
      user: {
        id: user.userId,
        email: user.email,
        role: user.role
      }
    });
  }
);

export default router;
