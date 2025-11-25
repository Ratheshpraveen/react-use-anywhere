import { JWTService } from '../services/jwtService';

export interface UserData {
  id: string;
  email: string;
  password: string;
}

export class User {
  private data: UserData;

  constructor(userData: UserData) {
    this.data = userData;
  }

  /**
   * Generate authentication tokens for the user
   * @returns Object containing access and refresh tokens
   */
  generateTokens(): { 
    accessToken: string, 
    refreshToken: string 
  } {
    return {
      accessToken: JWTService.generateAccessToken(this.data.id),
      refreshToken: JWTService.generateRefreshToken(this.data.id)
    };
  }

  /**
   * Validate user credentials
   * @param password Password to check
   * @returns Boolean indicating if credentials are valid
   */
  async validatePassword(password: string): Promise<boolean> {
    // In a real implementation, use a secure password hashing library like bcrypt
    return this.data.password === password;
  }

  /**
   * Get user data without sensitive information
   * @returns Sanitized user data
   */
  getSafeUserData() {
    const { password, ...safeData } = this.data;
    return safeData;
  }
}
