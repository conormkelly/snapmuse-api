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

  // Create the comment to generate an id field for the file upload if present,
  // We also don't have the text field until the audioStorageService
  // function has processed the req.body
  const comment = commentsService.build({
    postId,
    userId: res.locals.user.id,
  });

  // Upload the file, and extract req.body multipart form fields
  const file = await audioStorageService.upload(
    {
      commentId: comment.id,
      userId: res.locals.user.id,
    },
    req,
    res
  );

  // Append fields to the built comment
  comment.recordingSrc = file ? file.location : null;
  comment.text = req.body.text ? xss(req.body.text) : null;
  comment.parentId = req.body.parentId === 'null' ? null : req.body.parentId;

  if (!comment.text && !comment.recordingSrc) {
    return next(
      new ErrorResponse({
        statusCode: 400,
        message: `text or audio must be provided`,
      })
    );
  }

  await comment.save();

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
  const comments = await commentsService.getPostComments({ postId });
  return res.status(200).json({ success: true, data: comments });
});

exports.downloadAudio = asyncHandler((req, res, next) => {
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
});
