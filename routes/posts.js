const express = require('express');
const postsRouter = express.Router();

// Add controller methods
const {
  getAllPosts,
  loadPosts,
  deleteAllPosts,
} = require('../controllers/posts');

const { addComment, getPostComments } = require('../controllers/comments');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);
postsRouter.post('/', loadPosts);
postsRouter.delete('/', deleteAllPosts);

// Comments
postsRouter.post('/:postId/comments', addComment);
postsRouter.get('/:postId/comments', getPostComments);

module.exports = postsRouter;
