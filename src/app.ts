import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// Import routes
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.connectToDatabase();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Security middlewares
    this.app.use(helmet()); // Helps secure Express apps by setting various HTTP headers
    this.app.use(cors()); // Enable CORS for all routes

    // Body parsing middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private connectToDatabase() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';

    mongoose.connect(MONGODB_URI)
      .then(() => console.log('Connected to MongoDB'))
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      });
  }

  private initializeRoutes() {
    // Base route
    this.app.get('/', (req, res) => {
      res.json({ message: 'Welcome to the Authentication API' });
    });

    // Authentication routes
    this.app.use('/api/auth', authRoutes);
  }

  private initializeErrorHandling() {
    // 404 handler
    this.app.use((req, res, next) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Global error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });
  }

  public listen() {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

export default App;
