## JWT Authentication Implementation

### Dependencies Installed
- `jsonwebtoken`: For generating and verifying JSON Web Tokens
- `bcryptjs`: For password hashing and comparison
- `dotenv`: For managing environment variables

### Authentication Utility (`src/utils/auth.ts`)
The authentication utility provides the following key features:
- Password hashing using bcrypt
- JWT token generation
- JWT token verification
- Authentication middleware for route protection

#### Key Methods
- `hashPassword()`: Securely hash user passwords
- `comparePassword()`: Compare plain text password with hashed password
- `generateToken()`: Create a JWT token for authenticated users
- `verifyToken()`: Validate and decode JWT tokens
- `authMiddleware()`: Protect routes by validating JWT tokens

### Environment Configuration
- Created `.env` file with:
  - `JWT_SECRET`: A secret key for token signing
  - `JWT_EXPIRATION`: Token expiration time

### Usage Example
```typescript
// User registration
const hashedPassword = await AuthService.hashPassword(password);

// User login
const token = AuthService.generateToken(user);

// Protect a route
app.get('/protected-route', authMiddleware, (req, res) => {
  // Route logic for authenticated users
});
```

### Security Considerations
- Passwords are hashed before storage
- Tokens are signed with a secret key
- Tokens have an expiration time
- Route middleware validates tokens
