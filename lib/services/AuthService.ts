import jwt from 'jsonwebtoken';

interface UserCredentials {
  username: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  username: string;
  exp: number;
}

export class AuthService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
  private static TOKEN_EXPIRATION = '1h';

  // Simulate user authentication (replace with actual database check)
  static async authenticate(credentials: UserCredentials): Promise<string | null> {
    // TODO: Replace with actual user validation against a database
    if (credentials.username === 'admin' && credentials.password === 'password') {
      return this.generateToken(credentials.username);
    }
    return null;
  }

  static generateToken(username: string): string {
    const payload = {
      userId: 'user123', // Replace with actual user ID
      username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour expiration
    };

    return jwt.sign(payload, this.SECRET_KEY);
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.SECRET_KEY) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    return jwt.decode(token) as TokenPayload;
  }
}
