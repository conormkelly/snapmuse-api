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

const testCases = [
  {
    label: 'should be able to register with valid new username',
    requestBody: { username: 'test', password: 'Test1234' },
    expectedResponse: {
      statusCode: 201,
      properties: [{ name: 'success', expectedValue: true }, { name: 'data' }],
    },
  },
  {
    label: 'should not be able to register with existing username',
    requestBody: { username: 'test', password: 'Test1234' },
    expectedResponse: {
      statusCode: 400,
      properties: [
        { name: 'success', expectedValue: false },
        {
          name: 'message',
          expectedValue: 'Username already exists. Please try again.',
        },
      ],
    },
  },
  {
    label: 'should not have case-sensitive usernames',
    requestBody: { username: 'TEST', password: 'Test1234' },
    expectedResponse: {
      statusCode: 400,
      properties: [
        { name: 'success', expectedValue: false },
        {
          name: 'message',
          expectedValue: 'Username already exists. Please try again.',
        },
      ],
    },
  },
  {
    label: 'should not be able to register with invalid username',
    requestBody: { username: '', password: 'Test1234' },
    expectedResponse: {
      statusCode: 400,
      properties: [
        { name: 'success', expectedValue: false },
        {
          name: 'message',
          expectedValue:
            'Username must be at least 4 characters long. Please try again.',
        },
      ],
    },
  },
  {
    label: 'should not be able to register with invalid password',
    requestBody: { username: 'validusername', password: '' },
    expectedResponse: {
      statusCode: 400,
      properties: [
        { name: 'success', expectedValue: false },
        {
          name: 'message',
          expectedValue:
            'Password must be at least 8 characters in length and contain at least 1 number and 1 uppercase letter. Please try again.',
        },
      ],
    },
  },
];

describe('/auth/register', () => {
  for (const testCase of testCases) {
    it(testCase.label, async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testCase.requestBody);
      expect(res.statusCode).toEqual(testCase.expectedResponse.statusCode);
      for (const prop of testCase.expectedResponse.properties) {
        expect(res.body).toHaveProperty(prop.name);
        if (prop.expectedValue) {
          expect(res.body[prop.name]).toEqual(prop.expectedValue);
        }
      }
      expect(Object.keys(res.body).length).toEqual(
        testCase.expectedResponse.properties.length
      );
    });
  }
});
