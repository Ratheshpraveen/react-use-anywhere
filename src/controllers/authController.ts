import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authMiddleware';

// In a real app, this would be a database
const users: {[key: string]: {password: string, id: string}} = {};

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
    const userId = Date.now().toString(); // Simple unique ID generation
    users[username] = {
      password: hashedPassword,
      id: userId
    };

    // Generate token
    const token = generateToken({ id: userId, username });

    res.status(201).json({ 
      token, 
      user: { id: userId, username } 
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
    const { username, id } = req.body;
    
    // Generate new token
    const token = generateToken({ id, username });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during token refresh' });
  }
};
