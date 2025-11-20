import { LoginCredentials, RegisterCredentials, AuthState } from '../types';
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
      const accessToken = JWTService.generateAccessToken(mockUser);
      const refreshToken = JWTService.generateRefreshToken(mockUser);

      // Update auth state
      this.authState = {
        isAuthenticated: true,
        token: accessToken,
        user: mockUser
      };

      // Store refresh token (e.g., in localStorage or secure cookie)
      localStorage.setItem('refreshToken', refreshToken);

      return this.authState;
    } catch (error) {
      this.logout();
      throw new Error('Login failed');
    }
  }

  /**
   * Register a new user
   * @param credentials User registration credentials
   * @returns Authentication state
   */
  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    try {
      // TODO: Replace with actual registration logic (e.g., API call)
      const mockUser = {
        id: 'newUser123',
        email: credentials.email,
        role: credentials.role || 'user'
      };

      // Generate tokens
      const accessToken = JWTService.generateAccessToken(mockUser);
      const refreshToken = JWTService.generateRefreshToken(mockUser);

      // Update auth state
      this.authState = {
        isAuthenticated: true,
        token: accessToken,
        user: mockUser
      };

      // Store refresh token
      localStorage.setItem('refreshToken', refreshToken);

      return this.authState;
    } catch (error) {
      this.logout();
      throw new Error('Registration failed');
    }
  }

  /**
   * Refresh access token
   * @returns New authentication state with refreshed token
   */
  static async refreshToken(): Promise<AuthState> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const newAccessToken = JWTService.refreshAccessToken(refreshToken);

      // Update auth state with new token
      this.authState = {
        ...this.authState,
        token: newAccessToken
      };

      return this.authState;
    } catch (error) {
      this.logout();
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Logout user and clear authentication state
   */
  static logout(): void {
    this.authState = {
      isAuthenticated: false,
      token: null,
      user: null
    };
    localStorage.removeItem('refreshToken');
  }

  /**
   * Get current authentication state
   * @returns Current authentication state
   */
  static getAuthState(): AuthState {
    return this.authState;
  }
}
