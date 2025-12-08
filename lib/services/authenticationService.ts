import { JWTService } from './jwtService';
import { CustomJWTPayload, AuthState, initialAuthState } from '../types';

interface UserCredentials {
  email: string;
  password: string;
}

export class AuthenticationService {
  private static instance: AuthenticationService;
  private authState: AuthState = { ...initialAuthState };

  private constructor() {}

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  // Simulated login - replace with actual backend call
  async login(credentials: UserCredentials): Promise<boolean> {
    try {
      // TODO: Replace with actual backend authentication
      const mockUserId = 'user123';
      const payload: Omit<CustomJWTPayload, 'exp'> = {
        userId: mockUserId,
        email: credentials.email,
        role: 'user'
      };

      const accessToken = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      this.setAuthState({
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
        user: {
          id: mockUserId,
          email: credentials.email,
          role: 'user'
        },
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  logout(): void {
    this.authState = { ...initialAuthState };
  }

  refreshToken(): boolean {
    if (!this.authState.refreshToken) return false;

    const newAccessToken = JWTService.refreshAccessToken(this.authState.refreshToken);
    if (newAccessToken) {
      this.authState.token = newAccessToken;
      this.authState.expiresAt = Date.now() + 15 * 60 * 1000;
      return true;
    }
    return false;
  }

  isTokenExpired(): boolean {
    return !this.authState.expiresAt || Date.now() >= this.authState.expiresAt;
  }

  private setAuthState(newState: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...newState };
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }
}

export const authenticationService = AuthenticationService.getInstance();
