const Comment = require('../models/Comment');
const Post = require('../models/Post');
const commentsService = require('../services/comments');
const ErrorResponse = require('../utils/ErrorResponse');
const xss = require('xss');

const audioStorageService = require('../services/audioStorage');

async function addComment(req, res, next) {
  const { postId } = req.params;

  // Validate post exists
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Post not found.' })
    );
  }

  // Create the comment to generate an ObjectId for the file upload,
  // We also don't have the text field until the audioStorageService
  // function has processed the req.body
  const comment = new Comment({
    postId,
    username: res.locals.user.username,
    text: null,
    recordingSrc: null,
  });

  // Upload the file, and extract req.body multipart form fields
  const file = await audioStorageService.upload(
    {
      commentId: comment._id.toString(),
      username: res.locals.user.username,
    },
    req,
    res
  );
  if (file !== undefined) {
    comment.recordingSrc = file.location;
  }

  // Add text field
  comment.text = req.body.text ? xss(req.body.text) : null;

  if (comment.text || comment.recordingSrc) {
    await comment.save();
    return res.status(201).json({ success: true, data: comment });
  } else {
    return res.status(400).json({ sucess: false, data: null });
  }
}

async function getPostComments(req, res, next) {
  const { postId } = req.params;
  const comments = await commentsService.getPostComments({ postId });
  return res.status(200).json({ success: true, data: comments });
}

module.exports = {
  addComment,
  getPostComments,
};
