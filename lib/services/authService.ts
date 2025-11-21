import { LoginCredentials, RegisterCredentials, CustomJWTPayload, AuthState } from '../types';
import { JWTService } from './jwtService';

export class AuthService {
  private static storageKey = 'auth_token';
  private static refreshStorageKey = 'refresh_token';

  /**
   * Login user and generate tokens
   * @param credentials User login credentials
   * @returns AuthState object
   */
  static async login(credentials: LoginCredentials): Promise<AuthState> {
    try {
      // Simulate API call - replace with actual backend call
      const user = await this.validateCredentials(credentials);

      const payload: CustomJWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const accessToken = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      // Store tokens in local storage
      this.setTokens(accessToken, refreshToken);

      return {
        isAuthenticated: true,
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  /**
   * Register a new user
   * @param credentials User registration credentials
   * @returns AuthState object
   */
  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    try {
      // Simulate user creation - replace with actual backend call
      const user = await this.createUser(credentials);

      const payload: CustomJWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const accessToken = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      // Store tokens in local storage
      this.setTokens(accessToken, refreshToken);

      return {
        isAuthenticated: true,
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  /**
   * Refresh the access token
   * @returns New access token
   */
  static refreshAccessToken(): string | null {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    return JWTService.refreshAccessToken(refreshToken);
  }

  /**
   * Logout user by clearing tokens
   */
  static logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.refreshStorageKey);
  }

  /**
   * Get current authentication state
   * @returns Current AuthState
   */
  static getCurrentAuthState(): AuthState {
    const token = this.getAccessToken();
    if (!token) {
      return {
        isAuthenticated: false,
        token: null,
        user: null
      };
    }

    const decoded = JWTService.verifyToken(token);
    if (!decoded) {
      this.logout();
      return {
        isAuthenticated: false,
        token: null,
        user: null
      };
    }

    return {
      isAuthenticated: true,
      token,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    };
  }

  /**
   * Store tokens in local storage
   * @param accessToken Access token
   * @param refreshToken Refresh token
   */
  private static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.storageKey, accessToken);
    localStorage.setItem(this.refreshStorageKey, refreshToken);
  }

  /**
   * Get access token from local storage
   * @returns Access token or null
   */
  private static getAccessToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  /**
   * Get refresh token from local storage
   * @returns Refresh token or null
   */
  private static getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshStorageKey);
  }

  // Simulated methods - replace with actual backend calls
  private static async validateCredentials(credentials: LoginCredentials): Promise<{
    id: string;
    email: string;
    role?: string;
  }> {
    // Simulate user validation
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        id: 'user123',
        email: credentials.email,
        role: 'user'
      };
    }
    throw new Error('Invalid credentials');
  }

  private static async createUser(credentials: RegisterCredentials): Promise<{
    id: string;
    email: string;
    role?: string;
  }> {
    // Simulate user creation
    return {
      id: 'newuser' + Date.now(),
      email: credentials.email,
      role: credentials.role || 'user'
    };
  }
}
