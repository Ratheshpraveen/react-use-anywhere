import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JWT Configuration
export const jwtConfig = {
  // Secret key for JWT signing and verification
  secret: process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION',

  // Token expiration times
  accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1h',
  refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',

  // Issuer and audience (optional but recommended)
  issuer: process.env.JWT_ISSUER || 'your_app_name',
  audience: process.env.JWT_AUDIENCE || 'your_app_domain',

  // Token generation options
  tokenOptions: {
    algorithm: 'HS256', // Recommended algorithm
    expiresIn: '1h'
  },

  // Validation options
  verifyOptions: {
    algorithms: ['HS256'],
    issuer: this.issuer,
    audience: this.audience
  }
};

// Utility functions for token management
export const tokenUtils = {
  // Generate a random secret key
  generateSecretKey(): string {
    return require('crypto').randomBytes(64).toString('hex');
  },

  // Validate secret key strength
  isSecretKeyStrong(secret: string): boolean {
    // Check length and complexity
    return secret.length >= 64 && 
           /[A-Z]/.test(secret) && 
           /[a-z]/.test(secret) && 
           /[0-9]/.test(secret) && 
           /[^A-Za-z0-9]/.test(secret);
  }
};
