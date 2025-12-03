import JWTService from '../../lib/services/jwtService';
import { AuthState, UserProfile, CustomJWTPayload } from '../../lib/types';

class AuthService {
  private static authState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null
  };

  static async login(email: string, password: string): Promise<AuthState> {
    try {
      // TODO: Replace with actual authentication logic (e.g., API call)
      const isValidCredentials = this.validateCredentials(email, password);
      
      if (!isValidCredentials) {
        throw new Error('Invalid credentials');
      }

      const userProfile: UserProfile = {
        id: 'user123', // Mock user ID
        email,
        name: 'John Doe',
        role: 'user'
      };

      const payload: CustomJWTPayload = {
        userId: userProfile.id,
        email: userProfile.email,
        role: userProfile.role
      };

      const accessToken = JWTService.generateAccessToken(payload);
      const refreshToken = JWTService.generateRefreshToken(payload);

      this.authState = {
        isAuthenticated: true,
        user: userProfile,
        accessToken,
        refreshToken
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
      user: null,
      accessToken: null,
      refreshToken: null
    };
  }

  static refreshTokens(): AuthState | null {
    const { refreshToken } = this.authState;
    
    if (!refreshToken) return null;

    const newAccessToken = JWTService.refreshAccessToken(refreshToken);
    
    if (!newAccessToken) {
      this.logout();
      return null;
    }

    this.authState.accessToken = newAccessToken;
    return this.authState;
  }

  static getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Mock credential validation - replace with actual validation
  private static validateCredentials(email: string, password: string): boolean {
    // Implement actual credential validation
    return email === 'test@example.com' && password === 'password123';
  }
}

export default AuthService;
