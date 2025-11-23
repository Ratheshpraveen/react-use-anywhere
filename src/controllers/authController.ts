import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authMiddleware';

// Mock user database (replace with your actual user storage mechanism)
const users: { [key: string]: { id: string, email: string, password: string } } = {};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    if (users[email]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword
    };

    users[email] = newUser;

    // Generate JWT token
    const token = generateToken({ id: newUser.id, email });

    res.status(201).json({ 
      token, 
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = users[email];
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, email });

    res.json({ 
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = users[email];

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Generate new token
    const token = generateToken({ id: user.id, email });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during token refresh' });
  }
};
