const express = require('express');
const postsRouter = express.Router();

// Add controller methods
const {
  getAllPosts,
  getPostById,
  loadPosts,
  deleteAllPosts,
} = require('../controllers/posts');

// Controller methods
const { addComment, getPostComments } = require('../controllers/comments');

// Middleware
const { verifyToken } = require('../middleware/auth');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);
postsRouter.get('/:postId', getPostById);
postsRouter.post('/', loadPosts);
postsRouter.delete('/', deleteAllPosts);

// Comments
postsRouter.post('/:postId/comments', verifyToken, addComment);
postsRouter.get('/:postId/comments', getPostComments);

module.exports = postsRouter;
