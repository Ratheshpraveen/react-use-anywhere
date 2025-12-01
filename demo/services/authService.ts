import JWTService from '../../lib/services/jwtService';
import { LoginCredentials, JWTPayload, AuthTokens } from '../../lib/types';

// Mock user database (replace with actual backend call)
const MOCK_USERS = [
  { 
    id: '1', 
    email: 'user@example.com', 
    password: 'password123', 
    username: 'testuser',
    role: 'user' 
  }
];

class AuthenticationService {
  static async login(credentials: LoginCredentials): Promise<AuthTokens | null> {
    // In a real app, this would be an API call
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return null;
    }

    const { password, ...safeUserData } = user;
    const tokens = JWTService.generateTokenPair(safeUserData);

    // Store tokens in localStorage (consider more secure storage in production)
    this.storeTokens(tokens);

    return tokens;
  }

  static logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  static refreshTokens(): AuthTokens | null {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return null;
    }

    return JWTService.refreshAccessToken(refreshToken);
  }

  static getCurrentUser(): JWTPayload | null {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      return null;
    }

    return JWTService.extractUserFromToken(accessToken);
  }

  private static storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  static isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken && !this.isTokenExpired(accessToken);
  }

  private static isTokenExpired(token: string): boolean {
    const decoded = JWTService.verifyToken(token);
    return !decoded;
  }
}

export default AuthenticationService;
