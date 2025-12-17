const jwt = require('jsonwebtoken');

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      roles: user.roles 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' 
    }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id 
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' 
    }
  );
};

// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
