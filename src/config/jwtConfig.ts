import crypto from 'crypto';

// Generate a secure random secret key
const generateSecretKey = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || generateSecretKey();
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || generateSecretKey();

// Token Expiration Settings
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: '1h',     // Access token expires in 1 hour
  REFRESH_TOKEN: '7d',    // Refresh token expires in 7 days
};

// Additional JWT Configuration Options
export const JWT_CONFIG = {
  issuer: 'YourAppName',
  audience: 'YourDomain',
  algorithm: 'HS256' as const,
};

// Environment-based Configuration
export const isProduction = process.env.NODE_ENV === 'production';

// Security Recommendations
export const SECURITY_SETTINGS = {
  // Minimum password length
  MIN_PASSWORD_LENGTH: 8,
  
  // Maximum failed login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Lockout duration in minutes
  LOCKOUT_DURATION: 15,
  
  // Token rotation settings
  ROTATE_TOKENS: isProduction,
};

// Validate and warn about secret key generation
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.warn(
    'WARNING: JWT secrets are dynamically generated. ' +
    'In production, set JWT_SECRET and REFRESH_TOKEN_SECRET as environment variables.'
  );
}
