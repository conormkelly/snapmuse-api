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
const { runTests, getToken, getValidPostId } = require('./helpers/test-runner');

// Main application
const app = require('../app.js');

const tests = [
  {
    title: 'Comments - add text comment',
    testCases: [
      {
        label: 'should be able to add simple text comment',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          const postId = await getValidPostId();
          return { token, postId };
        },
        act: ({ token, postId }) => {
          return request(app)
            .post(`/api/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'multipart/form-data')
            .field('text', 'This is the comment text!');
        },
        assertations: {
          statusCode: 201,
          body: {
            success: true,
            data: ({ createdAt, id, postId, recordingSrc, text, username }) => {
              expect(createdAt).toBeDefined();
              expect(id).toBeDefined();
              expect(postId).toBeDefined();
              expect(recordingSrc).toBeDefined();
              expect(text).toBeDefined();
              expect(username).toBeDefined();
            },
          },
        },
      },
      {
        label: 'should return 404 if adding comment to nonexistent post',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          const postId = 'doesnt-exist';
          return { token, postId };
        },
        act: ({ token, postId }) => {
          return request(app)
            .post(`/api/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'multipart/form-data')
            .field('text', 'This is the comment text!');
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
  {
    title: 'Comments - get post comments',
    testCases: [
      {
        label: 'should be able to get comments for a valid post',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          const postId = await getValidPostId();
          return { token, postId };
        },
        act: ({ token, postId }) => {
          return request(app)
            .get(`/api/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send();
        },
        assertations: {
          statusCode: 200,
          body: {
            success: true,
            data: (actualValue) => {
              expect(actualValue).toBeDefined();
              expect(Array.isArray(actualValue)).toBe(true);
            },
          },
        },
      },
      {
        label: 'should return 404 if getting comments for nonexistent post',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          const postId = 'doesnt-exist';
          return { token, postId };
        },
        act: ({ token, postId }) => {
          return request(app)
            .get(`/api/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send();
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

runTests(tests);
