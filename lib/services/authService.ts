import { LoginCredentials, RegisterCredentials, CustomJWTPayload } from '../types';
import JWTService from './jwtService';

class AuthService {
  // Simulated user database (replace with actual database in real implementation)
  private static users = [
    { id: '1', email: 'user@example.com', password: 'password123', role: 'user' }
  ];

  static async login(credentials: LoginCredentials) {
    // Simulate user authentication (replace with actual authentication logic)
    const user = this.users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create JWT payload
    const payload: CustomJWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    // Generate tokens
    const accessToken = JWTService.generateAccessToken(payload);
    const refreshToken = JWTService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  static async register(credentials: RegisterCredentials) {
    // Simulate user registration (replace with actual registration logic)
    const existingUser = this.users.find(u => u.email === credentials.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: String(this.users.length + 1),
      email: credentials.email,
      password: credentials.password,
      role: credentials.role || 'user'
    };

    this.users.push(newUser);

    // Create JWT payload
    const payload: CustomJWTPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    };

    // Generate tokens
    const accessToken = JWTService.generateAccessToken(payload);
    const refreshToken = JWTService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    };
  }

  static async refreshTokens(refreshToken: string) {
    // Verify refresh token
    const decoded = JWTService.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Create new payload
    const payload: CustomJWTPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    // Generate new tokens
    const newAccessToken = JWTService.generateAccessToken(payload);
    const newRefreshToken = JWTService.generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}

export default AuthService;
