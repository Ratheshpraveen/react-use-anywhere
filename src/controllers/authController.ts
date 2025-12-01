import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock user database - replace with your actual user model/database
const users: any[] = [];

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

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
      username,
      email,
      password: hashedPassword
    };
    users.push(newUser);

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const { user } = req as any;
  const accessToken = generateAccessToken(user);
  res.json({ accessToken });
};

function generateAccessToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: process.env.JWT_EXPIRATION }
  );
}

function generateRefreshToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.REFRESH_TOKEN_SECRET as string, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );
}
