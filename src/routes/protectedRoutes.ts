import express, { Request, Response } from 'express';
import { verifyToken, checkRole } from '../middleware/authMiddleware';

const router = express.Router();

// Public route
router.get('/public', (req: Request, res: Response) => {
  res.json({ message: 'This is a public route' });
});

// Protected route (requires authentication)
router.get('/user', verifyToken, (req: Request, res: Response) => {
  res.json({ 
    message: 'This is a protected user route', 
    user: req.user 
  });
});

// Admin-only route
router.get('/admin', 
  verifyToken, 
  checkRole(['admin']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'This is an admin-only route',
      user: req.user 
    });
  }
);

// Moderator route (multiple roles allowed)
router.get('/moderator', 
  verifyToken, 
  checkRole(['admin', 'moderator']), 
  (req: Request, res: Response) => {
    res.json({ 
      message: 'This is a moderator route',
      user: req.user 
    });
  }
);

export default router;
