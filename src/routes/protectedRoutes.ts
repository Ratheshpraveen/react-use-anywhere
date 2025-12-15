import express, { Request, Response } from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

// Public route
router.get('/public', (req: Request, res: Response) => {
  res.json({ message: 'This is a public route accessible to everyone' });
});

// Protected route - requires authentication
router.get('/profile', authenticateJWT, (req: Request, res: Response) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

// Admin-only route
router.get('/admin', 
  authenticateJWT, 
  authorizeRole(['admin']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'Welcome, admin!', 
      user: req.user 
    });
  }
);

// Moderator or admin route
router.get('/moderate', 
  authenticateJWT, 
  authorizeRole(['admin', 'moderator']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'Moderation access granted', 
      user: req.user 
    });
  }
);

export default router;
