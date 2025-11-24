import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// In a real app, this would be a database
const users: { [key: string]: { id: string, email: string, password: string } } = {};

export const register = async (req: Request, res: Response) => {
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
    const userId = Date.now().toString(); // Simple unique ID generation
    users[email] = {
      id: userId,
      email,
      password: hashedPassword
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(201).json({ token, userId });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
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
    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token, userId: user.id });
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

    // Generate new JWT token
    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during token refresh' });
  }
};
