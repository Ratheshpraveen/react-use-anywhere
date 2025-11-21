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

      // Store refresh token securely (e.g., in secure storage or httpOnly cookie)
      localStorage.setItem('refreshToken', refreshToken);

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
      // TODO: Replace with actual registration logic (e.g., API call)
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

      const refreshToken = JWTService.generateRefreshToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      localStorage.setItem('refreshToken', refreshToken);

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

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      this.logout();
      return null;
    }

    const decodedToken = JWTService.verifyRefreshToken(refreshToken);
    
    if (!decodedToken) {
      this.logout();
      return null;
    }

    const newAccessToken = JWTService.generateAccessToken({
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role
    });

    this.authState.token = newAccessToken;
    return newAccessToken;
  }

  static logout(): void {
    localStorage.removeItem('refreshToken');
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
