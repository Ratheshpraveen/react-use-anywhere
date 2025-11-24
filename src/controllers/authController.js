const User = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    
    // Generate refresh token
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save();

    // Generate access token
    const accessToken = user.generateAccessToken();

    res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

const loginUser = async (req, res) => {
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

    // Generate refresh token
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    // Generate access token
    const accessToken = user.generateAccessToken();

    res.json({
      message: 'Login successful',
      user: { 
        id: user._id, 
        username: user.username 
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear refresh token
    req.user.refreshToken = null;
    await req.user.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during logout', 
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};
