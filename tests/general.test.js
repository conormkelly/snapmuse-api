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

describe('General', () => {
  it('should handle invalid JSON req body', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ THIS IS NOT VALID JSON');
    // Verify statusCode matches the expected value for the test case
    expect(res.statusCode).toEqual(400);
    // Verify res.body properties match
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toEqual(false);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Invalid JSON body provided.');

    expect(Object.keys(res.body).length).toEqual(2);
  });

  it('should respond with 404 for non-existent routes', async () => {
    const res = await request(app).get('/api/nonexistent/path').send();
    // Verify statusCode matches the expected value for the test case
    expect(res.statusCode).toEqual(404);
    // Verify res.body properties match
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toEqual(false);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Cannot GET /api/nonexistent/path');

    expect(Object.keys(res.body).length).toEqual(2);
  });
});
