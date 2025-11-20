import express from 'express';
import { login, register } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

// Example of a protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
