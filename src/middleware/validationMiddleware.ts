import { body } from 'express-validator';

export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must include uppercase, lowercase, number, and special character')
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];
