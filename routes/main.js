const express = require('express');
const mainRouter = express.Router();

// Import subrouters
const postsRouter = require('./posts');
const authRouter = require('./auth');

// Middleware
const { verifyToken } = require('../middleware/auth');

// Associate routes
mainRouter.use('/auth', authRouter);
mainRouter.use('/posts', verifyToken, postsRouter);

module.exports = mainRouter;
