import { LoginCredentials, RegisterCredentials, AuthState } from '../types';
import JWTService from './jwtService';

class AuthService {
  private static authState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null
  };

  static async login(credentials: LoginCredentials): Promise<AuthState> {
    try {
      // TODO: Replace with actual backend authentication logic
      const mockUser = {
        id: 'mock-user-id',
        email: credentials.email,
        role: 'user'
      };

      const token = JWTService.generateToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      this.authState = {
        isAuthenticated: true,
        token,
        user: mockUser
      };

      return this.authState;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    try {
      // TODO: Replace with actual backend registration logic
      const mockUser = {
        id: 'mock-user-id',
        email: credentials.email,
        role: credentials.role || 'user'
      };

      const token = JWTService.generateToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      this.authState = {
        isAuthenticated: true,
        token,
        user: mockUser
      };

      return this.authState;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  static logout(): void {
    this.authState = {
      isAuthenticated: false,
      token: null,
      user: null
    };
  }

  static getCurrentAuthState(): AuthState {
    return { ...this.authState };
  }

  static isTokenValid(token?: string | null): boolean {
    if (!token) return false;
    return !!JWTService.verifyToken(token);
  }

  static refreshToken(): string | null {
    const currentToken = this.authState.token;
    if (!currentToken) return null;

    const newToken = JWTService.refreshToken(currentToken);
    if (newToken) {
      this.authState.token = newToken;
    }
    return newToken;
  }
}

export default AuthService;
