# JWT Authentication Implementation

## Overview
This project implements JSON Web Token (JWT) based authentication using Express and TypeScript.

## Features
- Token generation
- JWT middleware for route protection
- Login endpoint
- Protected route example

## Setup
1. Install dependencies:
   ```bash
   npm install jsonwebtoken express dotenv
   ```

2. Configure `.env` file with:
   - `JWT_SECRET`: A strong, unique secret key
   - `JWT_EXPIRATION`: Token expiration time (default: 1h)

## Authentication Flow
1. User logs in via `/login` endpoint
2. Server validates credentials
3. If valid, generates a JWT token
4. Client includes token in `Authorization` header for protected routes

## Security Notes
- Always use HTTPS in production
- Rotate JWT_SECRET regularly
- Implement proper password hashing in production

## Example Usage
```typescript
// Login request
POST /login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Subsequent requests
Authorization: Bearer <token>
```
