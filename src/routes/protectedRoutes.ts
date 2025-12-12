import express from 'express';
import { verifyToken, checkRole } from '../middleware/authMiddleware';

const router = express.Router();

// Example of a route that requires authentication
router.get('/admin-dashboard', 
  verifyToken,  // Verify that the user is authenticated
  checkRole(['admin']),  // Ensure only admin can access
  (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard' });
  }
);

// Example of a route that requires authentication for any logged-in user
router.get('/user-profile', 
  verifyToken,  // Verify that the user is authenticated
  (req, res) => {
    const user = (req as any).user;
    res.json({ 
      message: 'User profile', 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      } 
    });
  }
);

export default router;
