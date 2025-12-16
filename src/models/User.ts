import { 
  Model, 
  Table, 
  Column, 
  DataType, 
  Unique, 
  IsEmail, 
  Default 
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  @Unique
  @IsEmail
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;

  @Default('user')
  @Column(DataType.ENUM('user', 'admin', 'moderator'))
  role!: string;

  // Method to check if the provided password is correct
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Method to generate access token
  generateAccessToken(): string {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email, 
        role: this.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );
  }

  // Method to generate refresh token
  generateRefreshToken(): string {
    const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
    return jwt.sign(
      { id: this.id }, 
      REFRESH_SECRET, 
      { expiresIn: '7d' }
    );
  }
}
