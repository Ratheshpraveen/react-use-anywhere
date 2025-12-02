# JWT Authentication Implementation

## Overview
This project implements JSON Web Token (JWT) based authentication using TypeScript, Express, `jsonwebtoken`, and `bcryptjs`.

## Components

### 1. Token Utilities (`tokenUtils.ts`)
- Generates JWT tokens with user payload
- Verifies and decodes JWT tokens
- Uses environment variables for secret and expiration

### 2. Authentication Middleware (`authMiddleware.ts`)
- Protects routes by verifying JWT tokens
- Extracts user information from valid tokens
- Handles token validation and authorization

### 3. Authentication Controller (`authController.ts`)
- Handles user login process
- Validates user credentials
- Generates JWT tokens upon successful authentication

## Authentication Flow
1. User provides email and password
2. Server validates credentials
3. If valid, a JWT token is generated
4. Token is sent back to the client
5. Client includes token in subsequent requests
6. Middleware verifies token for protected routes

## Security Considerations
- Store JWT_SECRET securely in .env file
- Use strong, unique secret key
- Set appropriate token expiration
- Implement token refresh mechanism if needed

## Environment Variables
- `JWT_SECRET`: Secret key for token signing
- `JWT_EXPIRATION`: Token validity duration (default: 1h)

## Usage Example
```typescript
// Protect a route
app.get('/protected-route', authMiddleware, (req, res) => {
  // Route logic here
});

// Login endpoint
app.post('/login', login);
```

## Notes
- This is a basic implementation
- Replace mock user database with actual database
- Add more robust error handling
- Implement user registration
- Consider adding token refresh mechanism
