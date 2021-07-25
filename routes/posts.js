const express = require('express');
const postsRouter = express.Router();

// Add controller methods
const { getAllPosts, loadPosts } = require('../controllers/posts');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);
postsRouter.post('/', loadPosts);

module.exports = postsRouter;
