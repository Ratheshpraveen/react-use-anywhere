# JWT Authentication Implementation

## Overview
This project implements JSON Web Token (JWT) authentication with the following features:
- User registration
- User login with token generation
- Protected routes
- Password hashing
- Token verification middleware

## Key Components
- `src/models/User.js`: User model with authentication methods
- `src/middleware/authMiddleware.js`: JWT token verification middleware
- `src/routes/authRoutes.js`: Authentication routes (register, login, protected)

## Authentication Flow
1. **Registration**: 
   - Send POST request to `/register`
   - Provide username, email, and password
   - Passwords are hashed before storage

2. **Login**:
   - Send POST request to `/login`
   - Receive JWT token if credentials are valid
   - Token includes user information and expiration

3. **Protected Routes**:
   - Include token in `Authorization` header
   - Format: `Bearer YOUR_TOKEN`
   - Middleware validates token before granting access

## Environment Variables
- `JWT_SECRET`: Secret key for token signing
- `JWT_EXPIRATION`: Token validity duration

## Security Notes
- Passwords are hashed using bcrypt
- Tokens are signed and verified
- Sensitive information is protected
- Token expiration prevents long-term access

## Recommended Improvements
- Implement database integration
- Add refresh token mechanism
- Implement more robust error handling
- Add password reset functionality
