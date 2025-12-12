import jwt from 'jsonwebtoken';

// JWT Secrets - In a real-world scenario, these should be environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

// Token generation utility
export const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Token verification utility
export const verifyToken = (token: string, isRefresh: boolean = false) => {
  try {
    const secret = isRefresh ? REFRESH_SECRET : JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Token decoding utility (without verification)
export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
