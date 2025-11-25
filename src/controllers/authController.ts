import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate tokens
    const payload = { id: user._id, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({ 
      message: 'User registered successfully', 
      accessToken, 
      refreshToken 
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const payload = { id: user._id, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const payload = { id: user._id, username: user.username };
    const newAccessToken = generateAccessToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
