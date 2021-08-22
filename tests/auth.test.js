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

const testCategories = [
  {
    title: 'Auth - registration',
    endpoint: '/api/auth/register',
    testCases: [
      {
        label: 'should be able to register with valid new username',
        requestBody: { username: 'test', password: 'Test1234' },
        expectedResponse: {
          statusCode: 201,
          properties: [
            { name: 'success', expectedValue: true },
            { name: 'data' },
          ],
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
        label: 'should not be able to register with empty username',
        requestBody: { username: '', password: 'Test1234' },
        expectedResponse: {
          statusCode: 400,
          properties: [
            { name: 'success', expectedValue: false },
            {
              name: 'message',
              expectedValue: 'Username must be between 4 - 20 characters.',
            },
          ],
        },
      },
      {
        label: 'should not be able to register with invalid username',
        requestBody: { username: '????????', password: 'Test1234' },
        expectedResponse: {
          statusCode: 400,
          properties: [
            { name: 'success', expectedValue: false },
            {
              name: 'message',
              expectedValue: 'Username must be between 4 - 20 characters.',
            },
          ],
        },
      },
      {
        label: 'should not be able to register with empty password',
        requestBody: { username: 'validusername', password: '' },
        expectedResponse: {
          statusCode: 400,
          properties: [
            { name: 'success', expectedValue: false },
            {
              name: 'message',
              expectedValue:
                'Password must be 8 - 200 characters in length and contain at least 1 number and 1 uppercase letter.',
            },
          ],
        },
      },
      {
        label: 'should not be able to register with weak password',
        requestBody: { username: 'validusername', password: 'password1' },
        expectedResponse: {
          statusCode: 400,
          properties: [
            { name: 'success', expectedValue: false },
            {
              name: 'message',
              expectedValue:
                'Password must be 8 - 200 characters in length and contain at least 1 number and 1 uppercase letter.',
            },
          ],
        },
      },
    ],
  },
  {
    title: 'Auth - login',
    endpoint: '/api/auth/login',
    testCases: [
      {
        label: 'should be able to login with valid credentials',
        requestBody: { username: 'test', password: 'Test1234' },
        expectedResponse: {
          statusCode: 200,
          properties: [
            { name: 'success', expectedValue: true },
            { name: 'data' },
          ],
        },
      },
      {
        label: 'should be able to login with case-insensitive username',
        requestBody: { username: 'TEST', password: 'Test1234' },
        expectedResponse: {
          statusCode: 200,
          properties: [
            { name: 'success', expectedValue: true },
            { name: 'data' },
          ],
        },
      },
      {
        label: 'should be unable to login with invalid credentials',
        requestBody: { username: 'non_existent', password: 'Test1234' },
        expectedResponse: {
          statusCode: 401,
          properties: [
            { name: 'success', expectedValue: false },
            { name: 'message', expectedValue: 'Invalid username or password.' },
          ],
        },
      },
    ],
  },
];

// Run all the test cases defined in the categories above
for (const testCategory of testCategories) {
  describe(testCategory.title, () => {
    // For each test case under the category
    for (const testCase of testCategory.testCases) {
      // Make the API request
      it(testCase.label, async () => {
        const res = await request(app)
          .post(testCategory.endpoint)
          .send(testCase.requestBody);
        // Verify statusCode matches the expected value for the test case
        expect(res.statusCode).toEqual(testCase.expectedResponse.statusCode);
        // Verify res.body properties match
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
}
