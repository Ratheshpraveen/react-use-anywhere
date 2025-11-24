import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock user database (replace with your actual database logic)
const users: { [key: string]: { id: string, username: string, password: string } } = {};

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
      id: Date.now().toString(),
      username,
      password: hashedPassword
    };
    users[username] = newUser;

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(201).json({ token, user: { id: newUser.id, username: newUser.username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
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
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');

    // Generate new token
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
