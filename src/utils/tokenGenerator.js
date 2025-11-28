const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRATION) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
