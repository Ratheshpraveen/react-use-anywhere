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
      // Simulated login - replace with actual backend call
      const mockUser = {
        id: 'user123',
        email: credentials.email,
        role: 'user'
      };

      // Generate tokens
      const accessToken = JWTService.generateToken({
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

      // Store refresh token in secure storage (e.g., httpOnly cookie or secure storage)
      this.storeRefreshToken(refreshToken);

      return this.authState;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    try {
      // Simulated registration - replace with actual backend call
      const mockUser = {
        id: 'user123',
        email: credentials.email,
        name: credentials.name,
        role: credentials.role || 'user'
      };

      // Generate tokens
      const accessToken = JWTService.generateToken({
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

      // Store refresh token in secure storage
      this.storeRefreshToken(refreshToken);

      return this.authState;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  static logout(): void {
    // Clear auth state and remove tokens
    this.authState = {
      isAuthenticated: false,
      token: null,
      user: null
    };
    this.removeRefreshToken();
  }

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    const newAccessToken = JWTService.refreshToken(refreshToken);
    if (newAccessToken) {
      this.authState.token = newAccessToken;
    }
    return newAccessToken;
  }

  static getAuthState(): AuthState {
    return this.authState;
  }

  private static storeRefreshToken(token: string): void {
    // In a real app, store in secure httpOnly cookie or secure storage
    localStorage.setItem('refreshToken', token);
  }

  private static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private static removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }
}
