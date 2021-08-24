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

// Helper services
const postsService = require('../services/posts');
const { runTests, getToken, getValidPostId } = require('./helpers/test-runner');

const testCategories = [
  {
    title: 'Posts - list all',
    testCases: [
      {
        label: 'should not be able to view posts without valid token',
        arrange: () => {},
        act: () => {
          return request(app).get('/api/posts');
        },
        assertations: {
          statusCode: 401,
          body: {
            success: false,
            message: 'Invalid credentials. Please login and try again.',
          },
        },
      },
      {
        label: 'should be able to view posts with a valid token',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          return { token };
        },
        act: ({ token }) => {
          return request(app)
            .get('/api/posts')
            .set('Authorization', `Bearer ${token}`);
        },
        assertations: {
          statusCode: 200,
          body: {
            success: true,
            data: [], // No posts have been added yet
          },
        },
      },
    ],
  },
  {
    title: 'Posts - add',
    testCases: [
      {
        label: 'should not be able to add posts if not admin',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          return { token };
        },
        act: ({ token }) => {
          return request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`);
        },
        assertations: {
          statusCode: 401,
          body: {
            success: false,
            message: 'You must be an administrator to perform this action.',
          },
        },
      },
      {
        label: 'should be able to add posts if admin',
        arrange: async () => {
          const token = await getToken({ isAdmin: true });
          return { token };
        },
        act: ({ token }) => {
          return request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`);
        },
        assertations: {
          statusCode: 201,
          body: {
            success: true,
            message: 'Successfully added posts.',
          },
        },
      },
    ],
  },
  {
    title: 'Posts - get by id',
    testCases: [
      {
        label: 'should be able to view a post with valid token',
        arrange: async () => {
          const postId = await getValidPostId();
          const token = await getToken({ isAdmin: false });
          return { token, postId };
        },
        act: ({ token, postId }) => {
          return request(app)
            .get(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        },
        assertations: {
          statusCode: 200,
          body: {
            success: true,
            data: (actualValue) => {
              expect(actualValue).toBeDefined();
            },
          },
        },
      },
      {
        label: 'should not be able to view a post without valid token',
        arrange: async () => {
          // Ensure posts loaded to get valid postId
          const postId = await getValidPostId();
          return { token: null, postId };
        },
        act: ({ token, postId }) => {
          return request(app)
            .get(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        },
        assertations: {
          statusCode: 401,
          body: {
            success: false,
            message: 'Invalid credentials. Please login and try again.',
          },
        },
      },
      {
        label: 'should return 404 if no post found',
        arrange: async () => {
          // Ensure posts loaded to get valid postId
          const token = await getToken({ isAdmin: false });
          return { token, postId: 'nonexistent-post-id' };
        },
        act: ({ token, postId }) => {
          return request(app)
            .get(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);
        },
        assertations: {
          statusCode: 404,
          body: {
            success: false,
            message: 'Post not found.',
          },
        },
      },
    ],
  },
];

runTests(testCategories);
