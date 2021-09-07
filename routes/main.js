const express = require('express');
const mainRouter = express.Router();

// Import subrouters
const authRouter = require('./auth');

const audioRouter = require('./audio');
const postsRouter = require('./posts');
const likesRouter = require('./likes');

// Middleware
const { verifyToken } = require('../middleware/auth');

// Associate routes
mainRouter.use('/auth', authRouter);

mainRouter.use('/audio', verifyToken, audioRouter);
mainRouter.use('/posts', verifyToken, postsRouter);
mainRouter.use('/likes', verifyToken, likesRouter);

module.exports = mainRouter;
