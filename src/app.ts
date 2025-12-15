import express from 'express';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();

// Middleware
app.use(express.json());

// Public routes
app.use('/auth', authRoutes);

// Example of a protected route
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route', 
    user: req.user 
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong', 
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
