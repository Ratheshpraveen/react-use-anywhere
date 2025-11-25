require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_default_secret_key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
};
