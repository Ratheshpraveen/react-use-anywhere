const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Mock user database (replace with your actual user model/database)
const users = [
  {
    id: 1,
    username: 'testuser',
    password: '$2a$10$123456789012345678901234567890' // hashed password
  }
];

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    // Generate token
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const protectedRoute = (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
};

module.exports = {
  login,
  protectedRoute
};
