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
const authService = require('../services/auth');
const commentsService = require('../services/comments');

const testCategories = [
  {
    title: 'User likes - like comment',
    testCases: [
      {
        label: 'should be able to like a comment',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          const user = await authService.findUserByUsername('standard_user');
          const postId = await getValidPostId();
          const comment = await commentsService.addComment({
            postId,
            userId: user.id,
            req: { body: { text: 'This is a test!' } },
            res: {},
          });
          return { token, commentId: comment.id };
        },
        act: ({ token, commentId }) => {
          return request(app)
            .put(`/api/likes/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ value: true });
        },
        assertations: {
          statusCode: 200,
          body: {
            success: true,
            data: ({ commentId, isLiked }) => {
              expect(commentId).toBeDefined();
              expect(isLiked).toEqual(true);
            },
          },
        },
      },
      {
        label: 'should be able to get all user likes',
        arrange: async () => {
          const token = await getToken({ isAdmin: false });
          return { token };
        },
        act: ({ token }) => {
          return request(app)
            .get(`/api/likes`)
            .set('Authorization', `Bearer ${token}`)
            .send();
        },
        assertations: {
          statusCode: 200,
          body: {
            success: true,
            data: (actualValue) => {
              // Verify it's an array of length 1
              expect(Array.isArray(actualValue)).toEqual(true);
              expect(actualValue.length).toEqual(1);
              console.log(actualValue);
            },
          },
        },
      },
    ],
  },
];

runTests(testCategories);
