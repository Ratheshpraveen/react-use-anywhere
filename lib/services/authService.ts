import { LoginCredentials, AuthResponse } from '../types';
import { JWTService } from './jwtService';

// Mock user database (replace with your actual database logic)
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' },
  { id: '2', email: 'admin@example.com', password: 'admin123', role: 'admin' }
];

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    // Find user in mock database (replace with actual database lookup)
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return null;
    }

    // Generate JWT token
    const token = JWTService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  static validateToken(token: string): boolean {
    return !!JWTService.verifyToken(token);
  }

  static refreshToken(token: string): string | null {
    return JWTService.refreshToken(token);
  }

  static logout(): void {
    // Implement logout logic (e.g., clear local storage)
  }
}
