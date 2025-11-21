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
      // Simulate API call - replace with actual authentication logic
      const user = await this.authenticateUser(credentials);

      // Create JWT payload
      const payload: CustomJWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      // Generate tokens
      const accessToken = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      // Store tokens
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
      throw new Error('Authentication failed');
    }
  }

  /**
   * Register a new user
   * @param credentials User registration credentials
   * @returns AuthState object
   */
  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    try {
      // Simulate user registration - replace with actual registration logic
      const user = await this.registerUser(credentials);

      // Create JWT payload
      const payload: CustomJWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role || 'user'
      };

      // Generate tokens
      const accessToken = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      // Store tokens
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
   * Refresh access token
   * @returns New access token
   */
  static refreshAccessToken(): string | null {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    return JWTService.refreshAccessToken(refreshToken);
  }

  /**
   * Logout user
   */
  static logout(): void {
    this.clearTokens();
  }

  /**
   * Check if user is authenticated
   * @returns Boolean indicating authentication status
   */
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const decoded = JWTService.verifyToken(token);
    return !!decoded;
  }

  /**
   * Get current user from token
   * @returns User object or null
   */
  static getCurrentUser(): { id: string; email: string; role?: string } | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded = JWTService.verifyToken(token);
    if (!decoded) return null;

    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  }

  // Private helper methods
  private static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.storageKey, accessToken);
    localStorage.setItem(this.refreshStorageKey, refreshToken);
  }

  private static getAccessToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  private static getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshStorageKey);
  }

  private static clearTokens(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.refreshStorageKey);
  }

  // Simulated authentication methods - replace with actual API calls
  private static async authenticateUser(credentials: LoginCredentials): Promise<{
    id: string;
    email: string;
    role?: string;
  }> {
    // Simulate user authentication
    // In a real app, this would be an API call to validate credentials
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        id: 'user123',
        email: credentials.email,
        role: 'user'
      };
    }
    throw new Error('Invalid credentials');
  }

  private static async registerUser(credentials: RegisterCredentials): Promise<{
    id: string;
    email: string;
    role?: string;
  }> {
    // Simulate user registration
    // In a real app, this would be an API call to create a new user
    return {
      id: 'newuser' + Date.now(),
      email: credentials.email,
      role: credentials.role || 'user'
    };
  }
}
