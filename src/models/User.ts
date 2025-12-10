import bcrypt from 'bcryptjs';
import AuthMiddleware from '../middleware/authMiddleware';

interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
}

class User implements UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }

  // Hash password before saving
  async hashPassword(): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(this.password, salt);
  }

  // Compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Generate authentication tokens
  generateTokens() {
    if (!this.id) {
      throw new Error('User ID is required to generate tokens');
    }

    const payload = {
      userId: this.id,
      email: this.email
    };

    return {
      accessToken: AuthMiddleware.generateAccessToken(payload),
      refreshToken: AuthMiddleware.generateRefreshToken(payload)
    };
  }

  // Sanitize user data for response
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

export default User;
