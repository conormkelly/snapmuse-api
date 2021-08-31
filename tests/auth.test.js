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
    title: 'Auth - registration',
    testCases: [
      {
        label: 'should be able to register with valid new username',
        arrange: () => {},
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: 'test', password: 'Test1234' });
        },
        assertations: {
          statusCode: 201,
          body: {
            success: true,
            data: (actualValue) => {
              expect(actualValue).toBeDefined();
            },
          },
        },
      },
      {
        label: 'should not be able to register with existing username',
        arrange: () => {}, // TODO: could confirm user exists
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: 'test', password: 'Test1234' });
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message: 'Username already exists. Please try again.',
          },
        },
      },
      {
        label: 'should not have case-sensitive usernames',
        arrange: () => {}, // TODO: could confirm user exists
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: 'TEST', password: 'Test1234' });
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message: 'Username already exists. Please try again.',
          },
        },
      },
      {
        label:
          'should not be able to register with username less than 3 characters',
        arrange: () => {}, // TODO: could confirm user exists
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: '123', password: 'Test1234' });
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message: 'Username must be between 4 - 20 characters.',
          },
        },
      },
      {
        label:
          'should not be able to register with username longer than 20 characters',
        arrange: () => {}, // TODO: could confirm user exists
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: 'twenty1charactersuser', password: 'Test1234' });
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message: 'Username must be between 4 - 20 characters.',
          },
        },
      },
      {
        label: 'should not be able to register with non-alphanumeric username',
        arrange: () => {}, // TODO: could confirm user exists
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: '????????', password: 'Test1234' });
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message: 'Username must be between 4 - 20 characters.',
          },
        },
      },
      {
        label: 'should not be able to register with password that is too short',
        arrange: () => {}, // TODO: could confirm user exists
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'Seven..' });
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message:
              'Password must be at least 8 characters long and contain at least 1 number, 1 lowercase letter and 1 uppercase letter.',
          },
        },
      },
      {
        label: 'should not be able to register with weak password',
        arrange: () => {}, // TODO: could confirm user exists
        act: () => {
          return request(app)
            .post('/api/auth/register')
            .send({ username: 'validuser1', password: 'invalid1' });
        },
        assertations: {
          statusCode: 400,
          body: {
            success: false,
            message:
              'Password must be at least 8 characters long and contain at least 1 number, 1 lowercase letter and 1 uppercase letter.',
          },
        },
      },
    ],
  },
  {
    title: 'Auth - login',
    testCases: [
      {
        label: 'should be able to login with valid credentials',
        arrange: () => {},
        act: () => {
          return request(app)
            .post('/api/auth/login')
            .send({ username: 'test', password: 'Test1234' });
        },
        assertations: {
          statusCode: 200,
          body: {
            success: true,
            data: (actualValue) => {
              expect(actualValue).toBeDefined(); // TODO: better way of validating token?
            },
          },
        },
      },
      {
        label: 'should be able to login with case-insensitive username',
        arrange: () => {},
        act: () => {
          return request(app)
            .post('/api/auth/login')
            .send({ username: 'TEST', password: 'Test1234' });
        },
        assertations: {
          statusCode: 200,
          body: {
            success: true,
            data: (actualValue) => {
              expect(actualValue).toBeDefined(); // TODO: better way of validating token?
            },
          },
        },
      },
      {
        label: 'should be unable to login with invalid credentials',
        arrange: () => {},
        act: () => {
          return request(app)
            .post('/api/auth/login')
            .send({ username: 'non_existent', password: 'Test1234' });
        },
        assertations: {
          statusCode: 401,
          body: {
            success: false,
            message: 'Incorrect username or password.',
          },
        },
      },
    ],
  },
];

runTests(tests);
