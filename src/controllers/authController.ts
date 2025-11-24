import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../middleware/authMiddleware';

// Mock user database (replace with actual database in production)
const users = [
  {
    id: 1,
    username: 'testuser',
    password: '$2b$10$X1/zB5x1Qh4zN4.eZz5Y4.Ry0z1Qh4zN4.eZz5Y4.Ry0z1Qh4zN4.eZz5Y4', // hashed password
  }
];

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = generateAccessToken({ id: user.id, username: user.username });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user (in a real app, you'd save to a database)
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword
  };
  users.push(newUser);

  const token = generateAccessToken({ id: newUser.id, username: newUser.username });
  res.status(201).json({ token });
};
