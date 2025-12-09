import express from 'express';
import { authRoutes } from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Authentication routes
app.use('/auth', authRoutes);

// Example of a protected route
app.get('/protected', 
  authMiddleware.verifyToken, 
  authMiddleware.protectRoute.userAndAdmin, 
  (req, res) => {
    res.json({ 
      message: 'Access granted to protected route', 
      user: req.user 
    });
});

// Global error handler for authentication errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
