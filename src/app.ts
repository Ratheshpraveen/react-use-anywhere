import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorMiddleware';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Global error handler
app.use(errorHandler);

export default app;
