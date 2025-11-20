import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authMiddleware';

// Mock user database (replace with actual database in production)
const users: { [key: string]: { id: number, username: string, password: string } } = {
  'testuser': {
    id: 1,
    username: 'testuser',
    password: '$2b$10$XYZ123' // Hashed password for 'password123'
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = users[username];
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, username: user.username });

    res.json({
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (users[username]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: Object.keys(users).length + 1,
      username,
      password: hashedPassword
    };

    users[username] = newUser;

    const token = generateToken({ id: newUser.id, username: newUser.username });

    res.status(201).json({
      token,
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { username } = req.body;
  const user = users[username];

  if (!user) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const token = generateToken({ id: user.id, username: user.username });
  res.json({ token });
};
