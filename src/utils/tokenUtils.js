const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
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

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken
};
