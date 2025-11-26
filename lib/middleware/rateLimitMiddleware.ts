import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '15 * 60 * 1000'), // Default 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '100'), // Default 100 requests
  message: {
    error: 'Too many authentication attempts, please try again later',
    code: 'TOO_MANY_REQUESTS'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // Optional: Custom handler for rate limit exceeded
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later',
      code: 'TOO_MANY_REQUESTS'
    });
  }
});
