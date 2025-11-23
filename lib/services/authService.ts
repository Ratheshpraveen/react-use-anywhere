import { LoginCredentials, TokenResponse } from '../types';
import { JWTService } from './jwtService';

export class AuthService {
  // Simulated user database (replace with actual database in production)
  private static users = [
    { id: '1', email: 'user@example.com', password: 'password123', role: 'user' }
  ];

  static async login(credentials: LoginCredentials): Promise<TokenResponse | null> {
    // Find user by email and validate password
    const user = this.users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) return null;

    // Generate tokens
    const accessToken = JWTService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = JWTService.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { accessToken, refreshToken };
  }

  static async refreshTokens(refreshToken: string): Promise<TokenResponse | null> {
    const decoded = JWTService.verifyRefreshToken(refreshToken);
    
    if (!decoded) return null;

    const user = this.users.find(u => u.id === decoded.userId);
    
    if (!user) return null;

    const newAccessToken = JWTService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const newRefreshToken = JWTService.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async validateToken(token: string): Promise<boolean> {
    return !!JWTService.verifyAccessToken(token);
  }
}
