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
const {
  addComment,
  getPostComments,
  downloadAudio,
} = require('../controllers/comments');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);
postsRouter.get('/:postId', getPostById);
postsRouter.post('/', loadPosts);
postsRouter.delete('/', deleteAllPosts);

// Comments
// ? TODO: Going to need role-based auth for ADDING + DELETING posts
postsRouter.post('/:postId/comments', addComment);
postsRouter.get('/:postId/comments', getPostComments);

// File download
postsRouter.get('/:postId/comments/:commentId/audio', downloadAudio);

module.exports = postsRouter;
