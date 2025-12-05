import express from 'express';
import { verifyToken, checkRole } from '../middleware/authMiddleware';

const router = express.Router();

// Example of a protected route that requires authentication
router.get('/profile', verifyToken, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

// Example of a route with role-based access control
router.get('/admin-dashboard', 
  verifyToken, 
  checkRole(['admin']), 
  (req, res) => {
    res.json({ 
      message: 'Welcome to admin dashboard' 
    });
  }
);

export default router;
