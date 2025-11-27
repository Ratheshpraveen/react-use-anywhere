const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      email: user.email 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRATION 
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
