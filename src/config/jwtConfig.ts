import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is set in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export const jwtConfig = {
  secret: JWT_SECRET,
  expirationTime: '1h', // Token expires in 1 hour
  issuer: 'your-app-name',
  audience: 'your-app-users',

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expirationTime,
      issuer: this.issuer,
      audience: this.audience,
    });
  },

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.secret, {
        issuer: this.issuer,
        audience: this.audience,
      }) as TokenPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  },
};
