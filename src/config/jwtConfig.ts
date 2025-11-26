import crypto from 'crypto';

export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
}

const generateSecureSecret = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

const jwtConfig: JwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || generateSecureSecret(),
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || generateSecureSecret(),
  accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
};

export default jwtConfig;
