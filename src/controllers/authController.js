const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const token = user.generateAuthToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error refreshing token' });
  }
};

module.exports = {
  register,
  login,
  refreshToken
};
