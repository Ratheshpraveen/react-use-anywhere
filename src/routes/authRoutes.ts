import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult, body } from 'express-validator';

// Simulated user model (you'll replace this with your actual database model)
interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

// Simulated user storage (replace with database in real implementation)
const users: User[] = [];

const router = express.Router();

// User registration validation middleware
const registrationValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// User registration route
router.post('/register', registrationValidation, async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role = 'user' } = req.body;

  try {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login route
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.json({ 
      token,
      user: { id: user.id, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token refresh route (optional)
router.post('/refresh-token', async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    // Verify the existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string, email: string, role: string };

    // Find the user
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Generate a new token
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;
