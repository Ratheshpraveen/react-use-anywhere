const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenGenerator');

// Mock user database (replace with your actual user storage mechanism)
const users = [];

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

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
  const accessToken = generateAccessToken({ id: newUser.id, email: newUser.email });
  const refreshToken = generateRefreshToken({ id: newUser.id, email: newUser.email });

  res.status(201).json({
    message: 'User registered successfully',
    accessToken,
    refreshToken
  });
};

const loginUser = async (req, res) => {
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
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  res.json({
    message: 'Login successful',
    accessToken,
    refreshToken
  });
};

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  // Generate new access token
  const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

  res.json({ accessToken });
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokens
};
