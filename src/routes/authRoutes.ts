import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';
import { UserRole } from '../middleware/authMiddleware';

// In a real app, replace with your database model
interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  refreshTokens?: string[];
}

// Simulated user store (replace with actual database in production)
const users: User[] = [];

export const authRoutes = express.Router();

// User Registration
authRoutes.post('/register', async (req, res) => {
  try {
    const { email, password, role = UserRole.USER } = req.body;

    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password: hashedPassword,
      role,
      refreshTokens: []
    };

    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User Login
authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      }, 
      jwtConfig.secretKey, 
      { 
        expiresIn: jwtConfig.accessTokenExpiration 
      }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        id: user.id, 
        type: 'refresh' 
      }, 
      jwtConfig.secretKey, 
      { 
        expiresIn: jwtConfig.refreshTokenExpiration 
      }
    );

    // Store refresh token (with rotation)
    if (!user.refreshTokens) user.refreshTokens = [];
    user.refreshTokens.push(refreshToken);

    // Implement token rotation
    if (user.refreshTokens.length > (jwtConfig.refreshTokenRotation.maxTokens || 5)) {
      user.refreshTokens.shift(); // Remove oldest token
    }

    res.json({ 
      accessToken, 
      refreshToken,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Token Refresh
authRoutes.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtConfig.secretKey) as { 
      id: string; 
      type: string 
    };

    // Find user with this refresh token
    const user = users.find(u => 
      u.refreshTokens?.includes(refreshToken) && u.id === decoded.id
    );

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      }, 
      jwtConfig.secretKey, 
      { 
        expiresIn: jwtConfig.accessTokenExpiration 
      }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});
