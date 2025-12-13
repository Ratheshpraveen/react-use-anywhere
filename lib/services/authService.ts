import { JWTService } from './jwtService';
import { CustomJWTPayload, AuthState, initialAuthState } from '../types';

export class AuthService {
  private static instance: AuthService;
  private state: AuthState = { ...initialAuthState };

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public login(email: string, password: string): boolean {
    // TODO: Replace with actual authentication logic (e.g., API call)
    if (email === 'test@example.com' && password === 'password') {
      const payload: Omit<CustomJWTPayload, 'exp'> = {
        userId: 'user123',
        email: email,
        role: 'user'
      };

      const accessToken = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      this.state = {
        token: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: true,
        user: {
          id: 'user123',
          email: email,
          role: 'user'
        },
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
      };

      return true;
    }
    return false;
  }

  public logout(): void {
    this.state = { ...initialAuthState };
  }

  public refreshToken(): boolean {
    if (!this.state.refreshToken) return false;

    const newAccessToken = JWTService.refreshAccessToken(this.state.refreshToken);
    
    if (newAccessToken) {
      this.state.token = newAccessToken;
      this.state.expiresAt = Date.now() + 15 * 60 * 1000;
      return true;
    }
    
    this.logout();
    return false;
  }

  public getState(): AuthState {
    // Check if token is expired
    if (this.state.expiresAt && Date.now() > this.state.expiresAt) {
      this.refreshToken();
    }
    return this.state;
  }

  public isAuthenticated(): boolean {
    return this.getState().isAuthenticated;
  }
}

export const authService = AuthService.getInstance();
