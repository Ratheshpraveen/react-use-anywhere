import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock user database (replace with your actual database logic)
const users: { username: string, password: string }[] = [];

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { username: user.username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Generate new token
    const newToken = jwt.sign(
      { username: (decoded as any).username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
