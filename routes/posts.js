const express = require('express');
const postsRouter = express.Router();

// Add controller methods
const {
  getAllPosts,
  loadPosts,
  deleteAllPosts,
} = require('../controllers/posts');

// Controller methods
const { addComment, getPostComments } = require('../controllers/comments');

// Middleware
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'public/' });

// Associate controllers with routes
postsRouter.get('/', verifyToken, getAllPosts);
postsRouter.post('/', loadPosts);
postsRouter.delete('/', deleteAllPosts);

// Comments
postsRouter.post('/:postId/comments', verifyToken, upload.single('audio'), addComment);
postsRouter.get('/:postId/comments', getPostComments);

module.exports = postsRouter;
