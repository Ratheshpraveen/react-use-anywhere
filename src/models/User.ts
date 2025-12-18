import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  role: string;
}

export class User implements UserInterface {
  id: string;
  email: string;
  password: string;
  role: string;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
  }

  // Hash password before saving
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT token
  generateToken(): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.TOKEN_EXPIRATION || '1h';

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      { userId: this.id, role: this.role },
      secret,
      { expiresIn }
    );
  }

  // Validate token
  static validateToken(token: string): { userId: string; role: string } {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.verify(token, secret) as { userId: string; role: string };
  }
}
