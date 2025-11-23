import { LoginCredentials, AuthState } from '../types';
import { JWTService } from './jwtService';

// Mock user database (replace with your actual user verification logic)
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password123', role: 'user' }
];

export class AuthService {
  /**
   * Login user and generate JWT tokens
   * @param credentials User login credentials
   * @returns Authentication state or null if login fails
   */
  static async login(credentials: LoginCredentials): Promise<AuthState | null> {
    // Mock user verification (replace with actual database/API call)
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

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

  /**
   * Refresh access token
   * @param refreshToken Current refresh token
   * @returns New authentication state or null if refresh fails
   */
  static async refreshToken(refreshToken: string): Promise<AuthState | null> {
    const newAccessToken = JWTService.refreshAccessToken(refreshToken);
    
    if (!newAccessToken) return null;

    // Decode the token to get user info (assuming the refresh token is valid)
    const decoded = JWTService.validateRefreshToken(refreshToken);
    
    if (!decoded) return null;

    return {
      isAuthenticated: true,
      token: newAccessToken,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    };
  }

  /**
   * Logout user (client-side token removal)
   * @returns Logged out authentication state
   */
  static logout(): AuthState {
    return {
      isAuthenticated: false,
      token: null,
      user: null
    };
  }
}
