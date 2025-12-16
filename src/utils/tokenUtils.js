const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
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
