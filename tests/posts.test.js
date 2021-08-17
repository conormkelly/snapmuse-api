// Environment Setup
process.env.NODE_ENV = 'test';
process.env.PORT = 9876;
process.env.JWT_SECRET = '012345678901234567890';
process.env.JWT_EXPIRY_DAYS = '30d';

jest.mock('../services/pexels');
jest.mock('../services/audioStorage');

// Make sure (in-memory) database is setup before tests
beforeAll(async () => {
  const db = require('../config/db');
  await db.sync();
});

// Test dependency
const request = require('supertest');

// Main application
const app = require('../app.js');

describe('Posts - list all', () => {
  it('should not be able to view posts without valid token', async () => {
    const res = await request(app).get('/posts');
    // Verify statusCode matches the expected value for the test case
    expect(res.statusCode).toEqual(401);
    // Verify res.body properties match
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toEqual(false);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual(
      'Invalid credentials. Please login and try again.'
    );

    expect(Object.keys(res.body).length).toEqual(2);
  });

  it('should be able to view posts with a valid token', async () => {
    // Arrange - login and get a token
    const tokenResponse = await request(app)
      .post('/auth/register')
      .send({ username: 'posttest1', password: 'Test1234' });

    expect(tokenResponse.body.data).toBeDefined();

    // Act
    const res = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${tokenResponse.body.data}`);

    // Assert
    // Verify statusCode matches the expected value for the test case
    expect(res.statusCode).toEqual(200);

    // Verify res.body properties match
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toEqual(true);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual([]);

    expect(Object.keys(res.body).length).toEqual(2);
  });
});
