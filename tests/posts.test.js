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

// Helper service
const authService = require('../services/auth');

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

describe('Posts - add', () => {
  it('should not be able to add posts if not admin', async () => {
    // Arrange - login and get a token
    const tokenRes = await request(app)
      .post('/auth/register')
      .send({ username: 'joesoap', password: 'Password1' });

    // Act
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    // Verify statusCode matches the expected value for the test case
    expect(res.statusCode).toEqual(401);
    // Verify res.body properties match
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toEqual(false);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual(
      'You must be an administrator to perform this action.'
    );

    expect(Object.keys(res.body).length).toEqual(2);
  });

  it('should be able to add posts if admin', async () => {
    // Arrange
    // Register and get a token
    const tokenRes = await request(app)
      .post('/auth/register')
      .send({ username: 'admin', password: 'Admin1234' });

    // Make that user an admin
    const adminUser = await authService.findUserByUsername('admin');
    adminUser.isAdmin = true;
    await adminUser.save();

    // Act
    const postAddRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    // Assert
    expect(postAddRes.statusCode).toEqual(201);
    expect(postAddRes.body.message).toBeDefined();

    const postGetRes = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    expect(postGetRes.statusCode).toEqual(200);

    // Verify res.body properties match
    expect(postGetRes.body).toHaveProperty('success');
    expect(postGetRes.body.success).toEqual(true);

    expect(postGetRes.body).toHaveProperty('data');
    expect(postGetRes.body.data.length).toBeGreaterThan(0);

    expect(Object.keys(postGetRes.body).length).toEqual(2);
  });
});

describe('Posts - get by id', () => {
  it('should be able to view a post with valid token', async () => {
    // Arrange - Make sure there are posts
    // Register and get a token
    const tokenRes = await request(app)
      .post('/auth/register')
      .send({ username: 'admin1', password: 'Admin1234' });

    // Make that user an admin
    const adminUser = await authService.findUserByUsername('admin1');
    adminUser.isAdmin = true;
    await adminUser.save();

    // Add the posts
    const postAddRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    expect(postAddRes.statusCode).toEqual(201);
    expect(postAddRes.body.success).toEqual(true);

    const getPostsRes = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    // Verify getPosts
    expect(getPostsRes.statusCode).toEqual(200);
    expect(getPostsRes.body).toHaveProperty('success');
    expect(getPostsRes.body.success).toEqual(true);
    expect(getPostsRes.body).toHaveProperty('data');
    expect(getPostsRes.body.data.length).toBeGreaterThan(0);
    expect(Object.keys(getPostsRes.body).length).toEqual(2);

    const firstPost = getPostsRes.body.data[0];

    // Act
    const getPostByIdRes = await request(app)
      .get(`/posts/${firstPost.id}`)
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    expect(getPostByIdRes.statusCode).toEqual(200);
    expect(getPostByIdRes.body).toHaveProperty('success');
    expect(getPostByIdRes.body.success).toEqual(true);
    expect(getPostByIdRes.body).toHaveProperty('data');
    expect(getPostByIdRes.body.data.id).toEqual(firstPost.id);
    expect(Object.keys(getPostByIdRes.body).length).toEqual(2);
  });

  it('should not be able to view a post without valid token', async () => {
    // Arrange - Make sure there are posts
    // Register and get a token
    const tokenRes = await request(app)
      .post('/auth/register')
      .send({ username: 'admin2', password: 'Admin1234' });

    // Make that user an admin
    const adminUser = await authService.findUserByUsername('admin2');
    adminUser.isAdmin = true;
    await adminUser.save();

    // Add the posts
    const postAddRes = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    expect(postAddRes.statusCode).toEqual(201);
    expect(postAddRes.body.success).toEqual(true);

    const getPostsRes = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    // Verify getPosts
    expect(getPostsRes.statusCode).toEqual(200);
    expect(getPostsRes.body).toHaveProperty('success');
    expect(getPostsRes.body.success).toEqual(true);
    expect(getPostsRes.body).toHaveProperty('data');
    expect(getPostsRes.body.data.length).toBeGreaterThan(0);
    expect(Object.keys(getPostsRes.body).length).toEqual(2);

    const firstPost = getPostsRes.body.data[0];

    // Act
    const getPostByIdRes = await request(app).get(`/posts/${firstPost.id}`);

    expect(getPostByIdRes.statusCode).toEqual(401);
    expect(getPostByIdRes.body).toHaveProperty('success');
    expect(getPostByIdRes.body.success).toEqual(false);
    expect(getPostByIdRes.body).toHaveProperty('message');
    expect(getPostByIdRes.body.message).toEqual(
      'Invalid credentials. Please login and try again.'
    );
    expect(Object.keys(getPostByIdRes.body).length).toEqual(2);
  });

  it('should return 404 if no post found', async () => {
    // Get a token
    const tokenRes = await request(app)
      .post('/auth/register')
      .send({ username: 'post404', password: 'Test4321' });

    const nonexistentId = '1234';

    // Add the posts
    const res = await request(app)
      .get(`/posts/${nonexistentId}`)
      .set('Authorization', `Bearer ${tokenRes.body.data}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toEqual(false);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Post not found.');
    expect(Object.keys(res.body).length).toEqual(2);
  });
});
