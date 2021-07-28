const express = require('express');
const mainRouter = express.Router();

// Import subrouters
const postsRouter = require('./posts');
const authRouter = require('./auth');

// Associate routes
mainRouter.use('/auth', authRouter);
mainRouter.use('/posts', postsRouter);

module.exports = mainRouter;
