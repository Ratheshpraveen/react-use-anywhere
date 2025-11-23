import { LoginCredentials, RegisterCredentials, AuthState, CustomJWTPayload } from '../types';
import { JWTService } from './jwtService';

export class AuthService {
  private static authState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null
  };

  /**
   * Login user and generate tokens
   * @param credentials User login credentials
   * @returns Authentication state
   */
  static async login(credentials: LoginCredentials): Promise<AuthState> {
    try {
      // TODO: Replace with actual authentication logic (e.g., API call)
      const mockUser = {
        id: 'user123',
        email: credentials.email,
        role: 'user'
      };

      // Generate tokens
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

      // Update and return auth state
      this.authState = {
        isAuthenticated: true,
        token: accessToken,
        user: mockUser
      };

      // Store refresh token (in real app, use secure storage)
      localStorage.setItem('refreshToken', refreshToken);

      return this.authState;
    } catch (error) {
      console.error('Login failed', error);
      return this.authState;
    }
  }

  /**
   * Register new user
   * @param credentials User registration credentials
   * @returns Authentication state
   */
  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    try {
      // TODO: Replace with actual registration logic (e.g., API call)
      const mockUser = {
        id: 'user123',
        email: credentials.email,
        name: credentials.name,
        role: credentials.role || 'user'
      };

      // Generate tokens
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

      // Update and return auth state
      this.authState = {
        isAuthenticated: true,
        token: accessToken,
        user: mockUser
      };

      // Store refresh token (in real app, use secure storage)
      localStorage.setItem('refreshToken', refreshToken);

      return this.authState;
    } catch (error) {
      console.error('Registration failed', error);
      return this.authState;
    }
  }

  /**
   * Refresh access token
   * @returns New authentication state or null if refresh fails
   */
  static async refreshToken(): Promise<AuthState | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const newAccessToken = JWTService.refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      // Refresh failed, logout user
      this.logout();
      return null;
    }

    // Update auth state with new token
    this.authState.token = newAccessToken;
    return this.authState;
  }

  /**
   * Logout user
   */
  static logout(): void {
    // Clear tokens and reset auth state
    localStorage.removeItem('refreshToken');
    this.authState = {
      isAuthenticated: false,
      token: null,
      user: null
    };
  }

  /**
   * Get current authentication state
   * @returns Current authentication state
   */
  static getAuthState(): AuthState {
    return this.authState;
  }
}
