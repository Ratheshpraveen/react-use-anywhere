const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const generateRefreshToken = (payload) => {
  return generateToken(payload, process.env.JWT_REFRESH_EXPIRES_IN);
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
};
