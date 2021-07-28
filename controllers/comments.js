const Comment = require('../models/Comment');
const Post = require('../models/Post');
const commentsService = require('../services/comments');
const ErrorResponse = require('../utils/ErrorResponse');

async function addComment(req, res, next) {
  // TODO: validate comment in middleware
  const { parentId, text } = req.body;
  const { postId } = req.params;
  // req.file!

  // Validate post exists
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Post not found.' })
    );
  }

  // Validate parent exists if provided
  if (parentId !== null) {
    const parentComment = await Comment.findOne({ _id: parentId });
    if (!parentComment) {
      return next(
        new ErrorResponse({ statusCode: 404, message: 'Comment not found.' })
      );
    }
  }

  // TODO: s3 service to save files?
  // if (req.file) {
  //   // save file to S3
  //   newComment.recordingSrc = await s3Service.save(req.file);
  //   await newComment.save();
  // }

  const newComment = await Comment.create({
    postId,
    parentId,
    userId: res.locals.user._id,
    text,
    // TODO: figure out how to handle recordingSrc
    recordingSrc: null,
  });

  return res.status(201).json({ success: true, data: newComment });
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
