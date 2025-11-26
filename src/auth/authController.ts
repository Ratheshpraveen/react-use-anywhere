import { Request, Response } from 'express';
import { generateToken, refreshToken } from './jwtUtils';
import bcrypt from 'bcryptjs';

// Mock user database - replace with actual database in production
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user'
  }
];

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, role = 'user' } = req.body;

  try {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Generate new token
    const newToken = refreshToken(decoded);

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: 'Error refreshing token' });
  }
};
