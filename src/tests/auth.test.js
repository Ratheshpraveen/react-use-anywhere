const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming you have an Express app setup
const User = require('../models/User');
const { JWT_SECRET } = require('../config/keys');
const jwt = require('jsonwebtoken');

describe('Authentication System', () => {
  // Connect to test database before tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  // Clear database before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect from database after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test user registration
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  // Test user login
  it('should login a user and return JWT tokens', async () => {
    // First, register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });

    // Then attempt login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  // Test token verification
  it('should verify a valid JWT token', async () => {
    // Create a test user
    const user = new User({
      username: 'verifyuser',
      email: 'verify@example.com',
      password: await bcrypt.hash('password123', 10)
    });
    await user.save();

    // Generate a token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );

    // Verify token using middleware (you'd need to set up a test route for this)
    const response = await request(app)
      .get('/api/protected-route')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
  });
});
