const Comment = require('../models/Comment');
const Post = require('../models/Post');
const commentsService = require('../services/comments');
const ErrorResponse = require('../utils/ErrorResponse');
const xss = require('xss');

const mongoose = require('mongoose');
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
  // We also don't have the parentId or text fields until the audioStorageService
  // function has processed the req.body
  const comment = new Comment({
    postId,
    parentId: null,
    userId: res.locals.user._id,
    text: null,
    recordingSrc: null,
  });

  // Upload the file, and extract req.body multipart form fields
  const file = await audioStorageService.upload(
    {
      commentId: comment._id.toString(),
      userId: res.locals.user._id.toString(),
    },
    req,
    res
  );
  if (file !== undefined) {
    comment.recordingSrc = file.location;
  }

  const { parentId, text } = req.body;

  // Validate parent exists if provided
  if (parentId) {
    const isValidObjectId = mongoose.isValidObjectId(parentId);

    if (isValidObjectId) {
      // Can only comment on a top level comment - no arbitrary nesting for simplicity's sake
      const parentComment = await Comment.findOne({
        _id: parentId,
        parentId: null,
      });
      if (!parentComment) {
        return next(
          new ErrorResponse({ statusCode: 404, message: 'Comment not found.' })
        );
      }
    } else {
      return next(
        new ErrorResponse({ statusCode: 404, message: 'Comment not found.' })
      );
    }
  }

  comment.text = text ? xss(text) : null;

  await comment.save();

  return res.status(201).json({ success: true, data: comment });
}

async function getPostComments(req, res, next) {
  const { postId } = req.params;
  const comments = await commentsService.getPostComments({ postId });
  return res.status(200).json({ success: true, comments });
}

module.exports = {
  addComment,
  getPostComments,
};
