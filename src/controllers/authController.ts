import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authMiddleware';

// Mock user database (replace with your actual database logic)
const users = [
  {
    id: '1',
    username: 'testuser',
    password: '$2b$10$XYZ123' // hashed password
  }
];

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
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

    // Generate token
    const token = generateToken({ id: user.id, username: user.username });

    res.json({ 
      token, 
      user: { id: user.id, username: user.username } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (mock implementation)
    const newUser = {
      id: String(users.length + 1),
      username,
      password: hashedPassword
    };
    users.push(newUser);

    // Generate token
    const token = generateToken({ id: newUser.id, username: newUser.username });

    res.status(201).json({ 
      token, 
      user: { id: newUser.id, username: newUser.username } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    // Verify existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // Generate new token
    const newToken = generateToken({ 
      id: decoded.id, 
      username: decoded.username 
    });

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
