import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Generic rate limiter for all routes
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Specific rate limiter for authentication routes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/registration attempts per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to log rate limit exceeded events
export const rateLimitLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    if (res.statusCode === 429) {
      console.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    }
  });
  next();
};
