# JWT Authentication System

## Overview
This project implements a JSON Web Token (JWT) based authentication system using TypeScript, Express, and supporting libraries.

## Key Components
- **Middleware**: `src/middleware/authMiddleware.ts`
  * Token verification
  * Role-based access control

- **Routes**: `src/routes/authRoutes.ts`
  * User registration
  * User login
  * Token refresh

- **Model**: `src/models/User.ts`
  * User data structure
  * Password hashing
  * Token generation

## Authentication Flow
1. User registers with username, email, and password
2. Password is hashed before storage
3. User can log in with email and password
4. Successful login generates a JWT token
5. Token is used for subsequent authenticated requests

## Security Features
- Password hashing with bcrypt
- JWT token with expiration
- Role-based access control
- Secure token verification middleware

## Environment Configuration
Configure authentication in the `.env` file:
- `JWT_SECRET`: A long, random secret key
- `TOKEN_EXPIRATION`: Token validity period

## Usage
- Register: `POST /auth/register`
- Login: `POST /auth/login`
- Refresh Token: `POST /auth/refresh-token`

**Note**: This is a basic implementation. Adapt for production with proper database integration and additional security measures.
