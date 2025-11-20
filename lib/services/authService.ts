import { LoginCredentials, RegisterCredentials } from '../types';
import { JWTService } from './jwtService';

// Mock user database (replace with actual database in production)
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' }
];

export class AuthService {
  static async login(credentials: LoginCredentials) {
    // Find user in mock database
    const user = MOCK_USERS.find(u => u.email === credentials.email && u.password === credentials.password);

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
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  static async register(credentials: RegisterCredentials) {
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user (in a real app, this would involve password hashing and database insertion)
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email: credentials.email,
      password: credentials.password,
      role: credentials.role || 'user'
    };

    MOCK_USERS.push(newUser);

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
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      accessToken,
      refreshToken
    };
  }

  static async refreshTokens(refreshToken: string) {
    const decoded = JWTService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = JWTService.generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });

    return { accessToken: newAccessToken };
  }
}
