import { generateToken, generateRefreshToken } from '../src/utils/tokenUtils';
import { User } from '../src/models/User';
import jwt from 'jsonwebtoken';

describe('Authentication Utilities', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    password: 'hashedpassword'
  };

  test('should generate a valid JWT token', () => {
    const token = generateToken(mockUser as any);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    expect(decoded).toHaveProperty('id', mockUser.id);
    expect(decoded).toHaveProperty('email', mockUser.email);
  });

  test('should generate a valid refresh token', () => {
    const refreshToken = generateRefreshToken(mockUser as any);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret');
    
    expect(decoded).toHaveProperty('id', mockUser.id);
    expect(decoded).toHaveProperty('email', mockUser.email);
  });
});
