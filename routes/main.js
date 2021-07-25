const express = require('express');
const mainRouter = express.Router();

// Import subrouters
const postsRouter = require('./posts');

// Associate routes
mainRouter.use('/posts', postsRouter)

module.exports = mainRouter;
