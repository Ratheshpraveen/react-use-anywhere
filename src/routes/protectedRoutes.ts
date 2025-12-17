import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Example of a route that requires authentication
router.get('/user-profile', authMiddleware, (req, res) => {
  // Only authenticated users can access this route
  res.json({ 
    message: 'Access granted', 
    user: req.user 
  });
});

// Example of a route with role-based access control
router.get('/admin-dashboard', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  (req, res) => {
    // Only admin users can access this route
    res.json({ 
      message: 'Admin dashboard access granted' 
    });
});

export default router;
