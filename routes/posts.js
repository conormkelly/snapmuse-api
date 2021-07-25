const express = require('express');
const postsRouter = express.Router();

// Add controller methods
const {
  getAllPosts,
  loadPosts,
  deleteAllPosts,
} = require('../controllers/posts');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);
postsRouter.post('/', loadPosts);
postsRouter.delete('/', deleteAllPosts);

module.exports = postsRouter;
