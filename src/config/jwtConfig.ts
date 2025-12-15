import crypto from 'crypto';

// Generate a secure random secret key
const generateSecretKey = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || generateSecretKey();
export const JWT_ISSUER = 'MyApp';
export const JWT_AUDIENCE = 'MyAppUsers';

// Token Expiration Settings
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: '1h',   // 1 hour
  REFRESH_TOKEN: '7d',  // 7 days
};

// Additional Security Configuration
export const JWT_CONFIG = {
  algorithm: 'HS256',
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

// Optional: Token Blacklist Management (in-memory, replace with Redis in production)
export class TokenBlacklist {
  private static blacklist: Set<string> = new Set();

  static add(token: string): void {
    this.blacklist.add(token);
  }

  static has(token: string): boolean {
    return this.blacklist.has(token);
  }

  static remove(token: string): void {
    this.blacklist.delete(token);
  }

  static clear(): void {
    this.blacklist.clear();
  }
}

// Environment-specific configurations
export const getJWTConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  const configs = {
    development: {
      expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN,
      secure: false
    },
    production: {
      expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN,
      secure: true
    },
    test: {
      expiresIn: '5m',
      secure: false
    }
  };

  return configs[env as keyof typeof configs] || configs.development;
};
