import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
  // @ts-ignore
  const userId = req.user.id;
  res.json({ 
    message: 'Access to protected route', 
    userId 
  });
});

export default router;
