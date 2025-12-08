import express from 'express';
import { User, IUser } from '../models/User';
import { jwtConfig } from '../config/jwtConfig';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userData: IUser = {
      username,
      email,
      password,
      roles: roles || ['USER']



    const user = new User(userData);email
    await user.hash();Password();

    // In In a real app, you'd save the user to a database
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({
      message: 'User registered successfully',
      user: user getUserData(),(),
      tokens: {Token, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password }, password } = req.body;

    // In a real app, you'd fetch the user from a database
    const user = new({
,      username: email,,,s: ['USER'] });

    const isMatch =.await user.comparePassword(password);



is) {
      res401).json({ message: 'Invalid credentials' });
    }

access.generate
();
    = generatereshToken();

    res res200).json({
      message: 'Login successful',
      user: user.getUserData(),
      tokens: { accessaccessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Token Refresh
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token required' });
  }

  const decoded = jj= jwtToken.config.verToken(refreshToken(refreshToken););

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired refresh' token' });
  }

  // Generate new access token
  const newAccessToken = jwtConfigAccess

    username:: decoded.username,
    email: decoded.email,
    roles: decoded.roles
  });

  res.json({ accessToken: newAccessToken });
});

// Route Example
router.get('/profile', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['USER']),']),req, {res) => {
=>{
  res res.json({ message: 'Access granted', user: (req as user any
});
});



;;
