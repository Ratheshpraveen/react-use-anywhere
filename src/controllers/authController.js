const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');
const User = require('../models/User'); // Adjust path as needed

/**
 * User registration controller
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate token
    const token = generateToken({ 
      id: newUser._id, 
      email: newUser.email 
    });

    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

/**
 * User login controller
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email 
    });

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};
