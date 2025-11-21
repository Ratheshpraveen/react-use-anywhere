import { LoginCredentials, RegisterCredentials } from '../types';
import { JWTService } from './jwtService';

// Mock user database (replace with actual database in production)
const USERS = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' }
];

export class AuthService {
  static async login(credentials: LoginCredentials) {
    // Find user by email and validate password
    const user = USERS.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

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

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  static async register(credentials: RegisterCredentials) {
    // Check if user already exists
    const existingUser = USERS.find(u => u.email === credentials.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user (mock implementation)
    const newUser = {
      id: String(USERS.length + 1),
      email: credentials.email,
      password: credentials.password,
      role: credentials.role || 'user'
    };

    USERS.push(newUser);

    // Generate tokens
    const accessToken = JWTService.generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    const refreshToken = JWTService.generateRefreshToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    };
  }

  static async refreshTokens(refreshToken: string) {
    const newAccessToken = JWTService.refreshAccessToken(refreshToken);
    
    if (!newAccessToken) {
      throw new Error('Invalid refresh token');
    }

    return { accessToken: newAccessToken };
  }
}
