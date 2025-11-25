import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT token
export const generateToken = (payload, expiresIn = '1h') => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn 
    });
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// Validate JWT token
export const validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    throw new Error('Invalid token');
  }
};

// Decode JWT token without verification (use carefully)
export const decodeToken = (token) => {
  return jwt.decode(token);
};
