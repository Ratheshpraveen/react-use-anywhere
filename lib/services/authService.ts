import { LoginCredentials, AuthResponse } from '../types';
import { JWTService } from './jwtService';

// Mock user database (replace with actual database in production)
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' },
  { id: '2', email: 'admin@example.com', password: 'admin123', role: 'admin' }
];

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    // Find user in mock database (replace with actual database query)
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

  static async validateToken(token: string): Promise<boolean> {
    const decoded = JWTService.verifyToken(token);
    return decoded !== null;
  }

  static async refreshToken(token: string): Promise<string | null> {
    return JWTService.refreshToken(token);
  }

  static async logout(): Promise<void> {
    // In a real app, you might want to invalidate the token on the server
    // For this example, we'll just return a resolved promise
    return Promise.resolve();
  }
}
