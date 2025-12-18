import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import { verifyToken } from './middleware/authMiddleware';

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database', {
  // Recommended connection options
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Authentication Routes
app.use('/auth', authRoutes);

// Example of a protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

// Error handling middleware
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
