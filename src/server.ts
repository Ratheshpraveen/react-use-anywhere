import express from 'express';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Public routes
app.use('/auth', authRoutes);

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: (req as any).userId });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
