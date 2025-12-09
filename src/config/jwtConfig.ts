import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  issuer: process.env.JWT_ISSUER || 'your-app-name',
  audience: process.env.JWT_AUDIENCE || 'your-app-domain',
};

// Ensure a secure secret is used in production
if (process.env.NODE_ENV === 'production' && jwtConfig.secret === 'fallback_secret_key_CHANGE_IN_PRODUCTION') {
  console.error('CRITICAL: JWT Secret not set in production environment!');
  process.exit(1);
}
