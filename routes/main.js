const express = require('express');
const mainRouter = express.Router();

// Import subrouters
const postsRouter = require('./posts');
const authRouter = require('./auth');
const likesRouter = require('./likes');

// Middleware
const { verifyToken } = require('../middleware/auth');

// Associate routes
mainRouter.use('/auth', authRouter);
mainRouter.use('/posts', verifyToken, postsRouter);
mainRouter.use('/likes', verifyToken, likesRouter);

mainRouter.get('/healthcheck', (req, res, next) => {
  res.status(200).json({ success: true, message: 'Alive and well!' });
});

mainRouter.get('/healthcheck2', (req, res, next) => {
  res.status(200).json({ success: true, message: '2nd change test.' });
});

module.exports = mainRouter;
