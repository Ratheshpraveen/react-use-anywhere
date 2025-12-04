import jwt from 'jsonwebtoken';

// JWT Secret Key - In a real application, this should be a secure, environment-specific secret
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Token expiration time
export const TOKEN_EXPIRATION = '1h';

// Function to generate JWT token
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

// Function to verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
