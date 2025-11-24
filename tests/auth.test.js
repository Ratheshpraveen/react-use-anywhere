const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/authRoutes');
const { verifyToken } = require('../src/utils/tokenUtils');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Authentication Routes', () => {
  let authToken;

  test('User registration', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    authToken = response.body.token;
  });

  test('User login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('Token verification', () => {
    const decoded = verifyToken(authToken);
    expect(decoded).toBeTruthy();
    expect(decoded.userId).toBe('test@example.com');
  });

  test('Protected route access', async () => {
    const response = await request(app)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toBeDefined();
  });
});
