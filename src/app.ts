import express from 'express';
import authRoutes from './routes/authRoutes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Global error handler for authentication
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token or no token provided'
    });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
