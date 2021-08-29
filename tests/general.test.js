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
const { runTests } = require('./helpers/test-runner');

// Main application
const app = require('../app.js');

const tests = [
  {
    title: 'General',
    testCases: [
      {
        label: 'should handle invalid JSON req body',
        arrange: () => {},
        act: () => {
          return request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send('{ THIS IS NOT VALID JSON');
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message: 'Invalid JSON body provided.',
          },
        },
      },
      {
        label: 'should respond with 404 for non-existent routes',
        arrange: () => {},
        act: () => request(app).get('/api/non/existent/route'),
        assertations: {
          statusCode: 404,
          body: {
            success: false,
            message: (actualValue) =>
              expect(actualValue).toEqual('Cannot GET /api/non/existent/route'),
          },
        },
      },
    ],
  },
];

runTests(tests);
