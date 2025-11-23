import { LoginCredentials, RegisterCredentials, AuthState } from '../types';
import { JWTService } from './jwtService';

export class AuthService {
  private static users: { [email: string]: { id: string; email: string; password: string; role?: string } } = {};

  static async login(credentials: LoginCredentials): Promise<AuthState> {
    // Simulated user lookup (replace with actual database logic)
    const user = Object.values(this.users).find(u => u.email === credentials.email && u.password === credentials.password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = JWTService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      isAuthenticated: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  static async register(credentials: RegisterCredentials): Promise<AuthState> {
    // Check if user already exists
    if (Object.values(this.users).some(u => u.email === credentials.email)) {
      throw new Error('User already exists');
    }

    // Generate unique ID (replace with actual ID generation)
    const userId = Date.now().toString();

    // Store user (replace with actual database logic)
    this.users[credentials.email] = {
      id: userId,
      email: credentials.email,
      password: credentials.password,
      role: credentials.role
    };

    // Generate token
    const token = JWTService.generateToken({
      userId,
      email: credentials.email,
      role: credentials.role
    });

    return {
      isAuthenticated: true,
      token,
      user: {
        id: userId,
        email: credentials.email,
        role: credentials.role
      }
    };
  }

  static async refreshAuth(currentToken: string): Promise<AuthState | null> {
    const newToken = JWTService.refreshToken(currentToken);
    
    if (!newToken) return null;

    const decoded = JWTService.verifyToken(newToken);
    
    if (!decoded) return null;

    return {
      isAuthenticated: true,
      token: newToken,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    };
  }

  static logout(): void {
    // Implement logout logic (e.g., clear tokens, reset state)
  }
}
