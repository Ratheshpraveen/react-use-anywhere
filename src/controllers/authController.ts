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
    // Find user by email
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
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
    res.status(500).json({ error: 'Server error during authentication' });
  }
};
