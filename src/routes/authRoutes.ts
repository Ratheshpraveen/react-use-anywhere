import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  refreshToken, 
  logout 
} from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must include uppercase, lowercase, number, and special character')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', authMiddleware, logout);

// Example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
  // Access authenticated user via (req as any).user.id
  res.json({ message: 'Access to protected route granted' });
});

export default router;
