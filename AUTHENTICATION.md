# JWT Authentication System

## Overview
This authentication system provides secure user registration, login, and token management using JSON Web Tokens (JWT).

## Features
- User registration with unique email and username
- Secure password hashing
- JWT-based authentication
- Access and refresh token generation
- Token validation middleware

## Key Components
- `authMiddleware.js`: Validates JWT tokens for protected routes
- `tokenUtils.js`: Generates access and refresh tokens
- `User.js`: Mongoose model with authentication methods
- `authRoutes.js`: Handles registration, login, and token refresh

## Environment Variables
- `JWT_SECRET`: Secret key for token signing
- `JWT_ACCESS_EXPIRATION`: Access token expiration time
- `JWT_REFRESH_EXPIRATION`: Refresh token expiration time

## Usage
1. Register a user
2. Login to receive access and refresh tokens
3. Use access token in `Authorization` header
4. Use refresh token to obtain new access tokens

## Security Notes
- Keep `JWT_SECRET` confidential
- Store tokens securely on the client-side
- Implement proper token rotation and revocation strategies
