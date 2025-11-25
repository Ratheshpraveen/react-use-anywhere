import crypto from 'crypto';

// Generate a secure random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

export default {
  JWT_SECRET: process.env.JWT_SECRET || generateSecretKey(),
  JWT_EXPIRATION: 86400, // 24 hours
};
