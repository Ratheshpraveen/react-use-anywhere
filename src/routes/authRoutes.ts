import express, { Request, Response } from 'express';
import { User, UserRoles } from '../models/User';
import AuthMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = UserRoles.USER } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create user instance
    const newUser = new User({
      username,
      email,
      password,
      role
    });

    // Hash password
    const hashedPassword = await newUser.hashPassword();
    
    // TODO: Save user to database (implement database logic)
    // For now, we'll just return a success response
    res.status(201).json({ 
      message: 'User registered successfully',
      username,
      email
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // TODO: Fetch user from database (implement database logic)
    // For now, we'll simulate a user
    const user = new User({
      id: 'mock-user-id',
      username: 'testuser',
      email,
      password: await new User({ username: '', email: '', password: 'hashedpassword' }).hashPassword(),
      role: UserRoles.USER
    });

    // Compare passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateToken();

    res.json({ 
      message: 'Login successful', 
      token,
      user: { 
        username: user.username, 
        email: user.email,
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected route example
router.get('/profile', 
  AuthMiddleware.authenticateJWT,
  AuthMiddleware.roleCheck([UserRoles.USER, UserRoles.ADMIN]),
  (req: Request, res: Response) => {
    res.json({ 
      message: 'Access granted to protected route',
      user: req.user 
    });
  }
);

// Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
  // In JWT, logout is typically handled client-side by removing the token
  res.json({ message: 'Logout successful' });
});

export default router;
