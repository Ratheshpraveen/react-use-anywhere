# JWT Authentication System Implementation

## Overview
This project implements a robust JWT (JSON Web Token) authentication system using the following key packages:
- `jsonwebtoken`: For generating and verifying JWT tokens
- `bcryptjs`: For secure password hashing
- `express-jwt`: For JWT middleware integration

## Key Features
- Token Generation
- Password Hashing
- Token Verification
- Role-based Access Control
- Error Handling for Authentication

## Middleware Functions
- `generateToken()`: Creates a JWT token with user details
- `verifyToken`: Middleware to validate incoming JWT tokens
- `hashPassword()`: Securely hash user passwords
- `comparePassword()`: Compare plain text passwords with hashed passwords
- `roleCheck()`: Implement role-based access control

## Security Considerations
- Tokens expire after 1 hour
- Passwords are hashed before storage
- Supports role-based access control
- Uses environment-based secret key

## Usage Example
```javascript
const { 
  generateToken, 
  verifyToken, 
  hashPassword, 
  roleCheck 
} = require('./src/middleware/authMiddleware');

// Generate token
const token = generateToken(user);

// Protect routes
app.get('/admin', verifyToken, roleCheck(['admin']), (req, res) => {
  // Admin-only route
});
```

## Important Notes
- Replace `JWT_SECRET` with a secure, environment-specific secret
- Implement proper error handling in your routes
- Always use HTTPS in production
