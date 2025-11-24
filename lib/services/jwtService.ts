import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

interface TokenPayload {
  userId: string;
  role: string;
  tokenId: string;
}

class JWTService {
  private redis: Redis;
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor() {
    // Initialize Redis connection
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    // Load token secrets and expiry from environment
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';
  }

  // Generate access token
  generateAccessToken(userId: string, role: string): string {
    const tokenId = uuidv4();
    const payload: TokenPayload = { 
      userId, 
      role, 
      tokenId 
    };

    return jwt.sign(payload, this.accessTokenSecret, { 
      expiresIn: this.accessTokenExpiry 
    });
  }

  // Generate refresh token
  generateRefreshToken(userId: string, role: string): string {
    const tokenId = uuidv4();
    const payload: TokenPayload = { 
      userId, 
      role, 
      tokenId 
    };

    // Store token ID in Redis for tracking
    this.storeRefreshToken(tokenId, userId);

    return jwt.sign(payload, this.refreshTokenSecret, { 
      expiresIn: this.refreshTokenExpiry 
    });
  }

  // Verify access token
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
      
      // Check if refresh token is blacklisted
      if (this.isRefreshTokenBlacklisted(decoded.tokenId)) {
        return null;
      }
      
      return decoded;
    } catch {
      return null;
    }
  }

  // Blacklist token
  async blacklistToken(tokenId: string, userId: string): Promise<void> {
    // Store blacklisted token in Redis with an expiry
    await this.redis.set(`blacklist:${tokenId}`, userId, 'EX', 60 * 60 * 24 * 7); // 7 days
  }

  // Check if token is blacklisted
  async isTokenBlacklisted(tokenId: string): Promise<boolean> {
    const result = await this.redis.exists(`blacklist:${tokenId}`);
    return result === 1;
  }

  // Store refresh token details
  private async storeRefreshToken(tokenId: string, userId: string): Promise<void> {
    await this.redis.set(`refresh:${tokenId}`, userId, 'EX', 60 * 60 * 24 * 7); // 7 days
  }

  // Check if refresh token is blacklisted
  private async isRefreshTokenBlacklisted(tokenId: string): Promise<boolean> {
    const result = await this.redis.exists(`blacklist:${tokenId}`);
    return result === 1;
  }

  // Revoke all tokens for a user
  async revokeAllTokens(userId: string): Promise<void> {
    // Implement logic to invalidate all tokens for a specific user
    const keys = await this.redis.keys(`refresh:*`);
    for (const key of keys) {
      const storedUserId = await this.redis.get(key);
      if (storedUserId === userId) {
        await this.redis.del(key);
      }
    }
  }
}

export default new JWTService();
