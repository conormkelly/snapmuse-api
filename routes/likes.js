const express = require('express');
const likesRouter = express.Router();

// Add controller methods
const { upsert, getAllUserLikes } = require('../controllers/likes');

// Associate controllers with routes
likesRouter.get('/', getAllUserLikes);
likesRouter.put('/:commentId', upsert);

module.exports = likesRouter;
