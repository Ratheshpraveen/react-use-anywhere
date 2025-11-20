import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock user database (replace with your actual database logic)
const users = [
  { id: 1, username: 'testuser', password: '$2b$10$someHashedPasswordHere' }
];

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (mock implementation)
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };
    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
