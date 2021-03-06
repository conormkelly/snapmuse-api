const express = require('express');
const postsRouter = express.Router();

// Add controller methods
const { getAllPosts, getPostById, loadPosts } = require('../controllers/posts');

// Controller methods
const { addComment, getPostComments } = require('../controllers/comments');

// Auth middleware
const { adminOnly } = require('../middleware/auth');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);
postsRouter.get('/:postId', getPostById);
postsRouter.post('/', adminOnly, loadPosts);

// Comments
postsRouter.post('/:postId/comments', addComment);
postsRouter.get('/:postId/comments', getPostComments);

module.exports = postsRouter;
