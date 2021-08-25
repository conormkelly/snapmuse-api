const asyncHandler = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const postsService = require('../services/posts');
const commentsService = require('../services/comments');
const audioStorageService = require('../services/audioStorage');

const xss = require('xss');

exports.addComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  // Validate post exists
  const post = await postsService.findById(postId);
  if (!post) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Post not found.' })
    );
  }

  const comment = await commentsService.addComment({
    postId,
    userId: res.locals.user.id,
    req,
    res,
  });

  return res.status(201).json({
    success: true,
    data: {
      id: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
      username: res.locals.user.username,
      text: comment.text,
      recordingSrc: comment.recordingSrc,
      createdAt: comment.createdAt,
    },
  });
});

exports.getPostComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const comments = await commentsService.getPostComments({
    postId,
    userId: res.locals.user.id,
  });
  return res.status(200).json({ success: true, data: comments });
});

exports.downloadAudio = (req, res, next) => {
  res.setHeader('Content-Disposition', 'attachment');
  return audioStorageService
    .getFileReadstream(req.params.commentId)
    .on('error', (err) => {
      console.log('File download error:', err);
      next(
        new ErrorResponse({
          statusCode: 500,
          message: 'Error downloading file. Try again later.',
        })
      );
    })
    .pipe(res);
};

exports.putCommentIsLikedValue = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { value } = req.body; // TODO: add validator

  const [post, comment] = await Promise.all([
    postsService.findById(postId),
    commentsService.findById(commentId),
  ]);

  if (!post) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Post not found.' })
    );
  }

  if (!comment) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Comment not found.' })
    );
  }

  const wasSuccessful = await commentsService.setIsLiked({
    commentId,
    postId,
    userId: res.locals.user.id,
    value,
  });

  if (!wasSuccessful) {
    return next(new Error('Failed to like the comment'));
  }

  return res
    .status(200)
    .json({ success: true, data: { commentId, isLiked: value } });
});
