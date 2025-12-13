import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { authenticateJWT, authErrorHandler } from './middleware/authMiddleware';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Public Routes
app.use('/auth', authRoutes);

// Protected Routes Example
const protectedRouter = express.Router();
protectedRouter.use(authenticateJWT);

protectedRouter.get('/profile', (req, res) => {
  res.json({ 
    message: 'Access to protected route', 
    user: req.user 
  });
});

app.use('/api', protectedRouter);

// Authentication Error Handling
app.use(authErrorHandler);

// Global Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong', 
    error: process.env.NODE_ENV === 'production' ? {} : err 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
