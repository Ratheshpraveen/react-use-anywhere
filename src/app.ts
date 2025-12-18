import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import { verifyToken } from './middleware/authMiddleware';

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/authdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Middleware
app.use(express.json());

// Public routes
app.use('/auth', authRoutes);

// Protected routes example
const protectedRouter = express.Router();
protectedRouter.use(verifyToken);

protectedRouter.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

app.use('/api', protectedRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
