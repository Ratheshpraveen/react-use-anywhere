import express from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);

// Example of role-based authorization
router.get('/admin', 
  authenticateToken, 
  authorizeRoles('admin'), 
  (req, res) => {
    res.json({ message: 'Admin access granted' });
  }
);

export default router;
