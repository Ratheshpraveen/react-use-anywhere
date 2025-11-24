module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_default_secret_key_here',
  TOKEN_EXPIRATION: '1h' // Token expires in 1 hour
};
