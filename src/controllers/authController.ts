import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/tokenUtils';

// Mock user database (replace with your actual user model/database)
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10)
  }
];

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (replace with your actual user creation logic)
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate token
    const token = generateToken({ 
      userId: newUser.id, 
      email: newUser.email 
    });

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        email: newUser.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
