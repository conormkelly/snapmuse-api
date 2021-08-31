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
  putCommentIsLikedValue,
} = require('../controllers/comments');

// Auth middleware
const { adminOnly } = require('../middleware/auth');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);
postsRouter.get('/:postId', getPostById);

//! ADMIN ONLY
postsRouter.post('/', adminOnly, loadPosts);
postsRouter.delete('/', adminOnly, deleteAllPosts);

// Comments
postsRouter.post('/:postId/comments', addComment);
postsRouter.get('/:postId/comments', getPostComments);

// File download
postsRouter.get('/:postId/comments/:commentId/audio', downloadAudio);

module.exports = postsRouter;
