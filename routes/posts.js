const express = require('express');
const postsRouter = express.Router();

// Add controller methods
const { getAllPosts } = require('../controllers/posts');

// Associate controllers with routes
postsRouter.get('/', getAllPosts);

module.exports = postsRouter;
