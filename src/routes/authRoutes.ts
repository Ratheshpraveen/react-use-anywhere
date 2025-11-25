import express, { Request, Response } from 'express';
import User from '../models/User';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Create user instance
    const user = new User({ username, email, password });

    // Hash password
    await user.hashPassword();

    // TODO: Save user to database (replace with your database logic)
    // const savedUser = await userRepository.save(user);

    // Generate token
    const token = user.generateToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // TODO: Fetch user from database (replace with your database logic)
    // const user = await userRepository.findByEmail(email);
    const user = new User({ 
      id: 'mock-id', 
      username: 'mockuser', 
      email, 
      password: await new User({ username: '', email: '', password }).hashPassword() 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateToken();

    res.json({ 
      message: 'Login successful', 
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Protected route example
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  // Access authenticated user via (req as any).user
  res.json({ 
    message: 'Access to protected route', 
    user: (req as any).user 
  });
});

export default router;
