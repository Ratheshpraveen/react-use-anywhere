import { LoginCredentials, RegisterCredentials, AuthState, CustomJWTPayload } from '../types';
import { JWTService } from './jwtService';

// Mock user database (replace with actual database in production)
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' }
];

export class AuthService {
  /**
   * Login user and generate tokens
   * @param credentials User login credentials
   * @returns Authentication state or null
   */
  static async login(credentials: LoginCredentials): Promise<AuthState | null> {
    // Find user in mock database (replace with actual database query)
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const accessToken = JWTService.generateAccessToken(user.id, user.email, user.role);
      const refreshToken = JWTService.generateRefreshToken(user.id, user.email);

      return {
        isAuthenticated: true,
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    }

    return null;
  }

  /**
   * Register a new user
   * @param credentials User registration credentials
   * @returns Authentication state or null
   */
  static async register(credentials: RegisterCredentials): Promise<AuthState | null> {
    // Check if user already exists (mock implementation)
    const existingUser = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (existingUser) {
      return null;
    }

    // Create new user (mock implementation)
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email: credentials.email,
      password: credentials.password,
      role: credentials.role || 'user'
    };

    MOCK_USERS.push(newUser);

    const accessToken = JWTService.generateAccessToken(newUser.id, newUser.email, newUser.role);
    const refreshToken = JWTService.generateRefreshToken(newUser.id, newUser.email);

    return {
      isAuthenticated: true,
      token: accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    };
  }

  /**
   * Refresh access token
   * @param refreshToken Existing refresh token
   * @returns New authentication state or null
   */
  static async refreshToken(refreshToken: string): Promise<AuthState | null> {
    const decoded = JWTService.verifyRefreshToken(refreshToken);

    if (decoded) {
      const user = MOCK_USERS.find(u => u.id === decoded.userId);

      if (user) {
        const newAccessToken = JWTService.generateAccessToken(user.id, user.email, user.role);

        return {
          isAuthenticated: true,
          token: newAccessToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        };
      }
    }

    return null;
  }

  /**
   * Validate JWT token
   * @param token JWT access token
   * @returns Decoded token payload or null
   */
  static validateToken(token: string): CustomJWTPayload | null {
    return JWTService.verifyAccessToken(token);
  }
}
