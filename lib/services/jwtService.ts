import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

interface TokenPayload {
  userId: string;
  role: string;
}

class JwtService {
  private redis: Redis;
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, { 
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' 
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' 
    });

    // Store refresh token in Redis with user ID as key
    this.redis.set(`refresh_token:${payload.userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return refreshToken;
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
      
      // Check if refresh token exists in Redis
      const storedToken = await this.redis.get(`refresh_token:${decoded.userId}`);
      
      if (storedToken !== token) {
        throw new Error('Refresh token is invalid');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    await this.redis.del(`refresh_token:${userId}`);
  }
}

export default new JwtService();
