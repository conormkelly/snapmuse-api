const Post = require('../models/Post');
const Comment = require('../models/Comment');
const UserLike = require('../models/UserLike');

const ErrorResponse = require('../utils/ErrorResponse');
const audioStorageService = require('./audioStorage');
const xss = require('xss');

/**
 * Find a comment by id.
 * @returns {Promise<Comment>}
 */
function findById(commentId) {
  return Comment.findByPk(commentId);
}

async function getPostComments({ postId, userId }) {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new ErrorResponse({ statusCode: 404, message: 'Post not found.' });
  }
  return post.getComments(userId);
}

async function addComment({ postId, userId, req, res }) {
  // Create the comment to generate an id field for the file upload if present,
  // We also don't have the text field until the audioStorageService
  // function has processed the req.body
  const comment = Comment.build({
    postId,
    userId,
  });

  // Upload the file, and extract req.body multipart form fields
  const file = await audioStorageService.upload(
    {
      commentId: comment.id,
      userId: userId,
    },
    req,
    res
  );

  // Append fields to the built comment
  comment.recordingSrc = file ? file.location : null;
  comment.text = req.body.text ? xss(req.body.text) : null;
  comment.parentId = req.body.parentId === 'null' ? null : req.body.parentId;

  if (!comment.text && !comment.recordingSrc) {
    throw new ErrorResponse({
      statusCode: 400,
      message: `text or audio must be provided`,
    });
  }

  await comment.save();

  return comment;
}

module.exports = {
  addComment,
  getPostComments,
  findById,
};
