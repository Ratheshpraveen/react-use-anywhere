import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Simulated user database (replace with your actual database logic)
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
    const userId = Object.keys(users).length + 1;
    users[username] = {
      id: userId,
      username,
      password: hashedPassword
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(201).json({ token, user: { id: userId, username } });
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token, user: { id: user.id, username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = users[username];

    if (!user) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    // Generate new JWT token
    const token = jwt.sign(
      { id: user.id, username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during token refresh' });
  }
};
