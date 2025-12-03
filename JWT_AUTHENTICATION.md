# JWT Authentication Implementation

## Overview
This project implements JSON Web Token (JWT) based authentication with the following features:
- User registration
- User login
- Token-based authentication
- Role-based access control
- Token refresh mechanism

## Key Components
- **Middleware**: `authMiddleware.ts`
  - Token verification
  - Role-based access control

- **Routes**: `authRoutes.ts`
  - `/register`: User registration
  - `/login`: User authentication
  - `/refresh-token`: Token renewal

- **Model**: `User.ts`
  - User schema with roles
  - Secure password storage
  - Refresh token management

- **Utilities**: `tokenUtils.ts`
  - Token generation
  - Token verification
  - Token blacklisting

## Authentication Flow
1. User registers with username, email, and password
2. Password is hashed before storage
3. On login, credentials are verified
4. Access and refresh tokens are generated
5. Tokens are used for subsequent authenticated requests

## Security Features
- Password hashing with bcryptjs
- JWT token with expiration
- Refresh token mechanism
- Role-based access control
- Token blacklisting for logout

## Environment Configuration
- Set `JWT_SECRET` and `REFRESH_SECRET` in environment variables
- Use strong, unique secrets in production

## Recommended Improvements
- Implement more robust token storage (e.g., Redis)
- Add password reset functionality
- Implement multi-factor authentication
- Add more granular role permissions

## Usage Example
```typescript
// Protect a route
router.get('/protected', verifyToken, checkRole(['admin']), (req, res) => {
  // Only accessible by admins with valid token
});
```

## Notes
- Always use HTTPS in production
- Regularly rotate secret keys
- Implement proper error handling
