import crypto from 'crypto';

// Generate a secure random secret key
const generateSecretKey = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || generateSecretKey(),
  expiresIn: '1h', // Token expires in 1 hour
  issuer: 'MyAppAuthSystem',
  algorithms: ['HS256'] // Recommended algorithm
};

// Function to generate a new secret key if needed
export const regenerateSecretKey = (): string => {
  const newSecret = generateSecretKey();
  process.env.JWT_SECRET = newSecret;
  return newSecret;
};
