import { Request, Response } from 'express';
import { hashPassword, comparePassword, generateToken } from '../utils/authUtils';

// This would typically be replaced with a database interaction
const users: Array<{id: string, email: string, password: string}> = [];

/**
 * User registration controller
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user (in a real app, this would be a database insert)
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword
    };
    users.push(newUser);

    // Generate JWT token
    const token = generateToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * User login controller
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
