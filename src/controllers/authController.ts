import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authMiddleware';

// This is a mock user database. In a real app, you'd use a real database
const users: { [key: string]: { id: number, username: string, password: string } } = {};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    if (users[username]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: Object.keys(users).length + 1,
      username,
      password: hashedPassword
    };

    users[username] = newUser;

    // Generate token
    const token = generateToken({ id: newUser.id, username });

    res.status(201).json({ 
      token, 
      user: { id: newUser.id, username } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = users[username];
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: user.id, username });

    res.json({ 
      token, 
      user: { id: user.id, username } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = users[username];

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Generate new token
    const token = generateToken({ id: user.id, username });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during token refresh' });
  }
};
