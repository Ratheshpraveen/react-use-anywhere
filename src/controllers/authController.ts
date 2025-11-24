import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, refreshToken } from '../middleware/authMiddleware';

// Simulated user storage - in a real app, this would be a database
const users: any[] = [];

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate token
    const token = generateToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshUserToken = (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const newToken = refreshToken(token);
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Token refresh failed' });
  }
};
