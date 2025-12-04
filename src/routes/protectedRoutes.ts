import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

// Example of a protected route that requires authentication
router.get('/profile', authenticateJWT, (req, res) => {
  // Only authenticated users can access this route
  res.json({ 
    message: 'Protected route', 
    user: req.user 
  });
});

// Example of a route with role-based access control
router.get('/admin-dashboard', 
  authenticateJWT, 
  requireRole(['admin']), 
  (req, res) => {
    res.json({ 
      message: 'Admin dashboard access granted' 
    });
  }
);

export default router;
