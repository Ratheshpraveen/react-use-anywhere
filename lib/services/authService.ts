import { LoginCredentials, RegisterCredentials, AuthState } from '../types';
import { JWTService } from './jwtService';

export class AuthService {
  private static authState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null
  };

  static async login(credentials: LoginCredentials): Promise<AuthState> {
    try {
      // TODO: Replace with actual authentication logic (e.g., API call)
      const mockUser = {
        id: 'user123',
        email: credentials.email,
        role: 'user'
      };

      const accessToken = JWTService.generateAccessToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      const refreshToken = JWTService.generateRefreshToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      // Store refresh token securely (e.g., httpOnly cookie or secure storage)
      this.authState = {
        isAuthenticated: true,
        token: accessToken,
        user: mockUser
      };

      return this.authState;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    try {
      // TODO: Replace with actual registration logic
      const mockUser = {
        id: 'newUser123',
        email: credentials.email,
        name: credentials.name,
        role: credentials.role || 'user'
      };

      const accessToken = JWTService.generateAccessToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      this.authState = {
        isAuthenticated: true,
        token: accessToken,
        user: mockUser
      };

      return this.authState;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  static async refreshToken(currentRefreshToken: string): Promise<string | null> {
    const newAccessToken = JWTService.refreshAccessToken(currentRefreshToken);
    
    if (newAccessToken) {
      this.authState.token = newAccessToken;
      return newAccessToken;
    }

    return null;
  }

  static logout(): void {
    this.authState = {
      isAuthenticated: false,
      token: null,
      user: null
    };
  }

  static getCurrentAuthState(): AuthState {
    return this.authState;
  }
}
