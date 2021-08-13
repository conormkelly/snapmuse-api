const Comment = require('../models/Comment');
const Post = require('../models/Post');
const commentsService = require('../services/comments');
const ErrorResponse = require('../utils/ErrorResponse');
const xss = require('xss');

const audioStorageService = require('../services/audioStorage');

async function addComment(req, res, next) {
  const { postId } = req.params;

  // Validate post exists
  const post = await Post.findByPk(postId);
  if (!post) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Post not found.' })
    );
  }

  // Create the comment to generate an ObjectId for the file upload,
  // We also don't have the text field until the audioStorageService
  // function has processed the req.body
  const comment = Comment.build({
    postId,
    userId: res.locals.user.id,
    text: null,
    parentId: null,
    recordingSrc: null,
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
  if (file !== undefined) {
    comment.recordingSrc = file.location;
  }

  // Add text field
  comment.text = req.body.text ? xss(req.body.text) : null;
  comment.parentId = req.body.parentId === 'null' ? null : req.body.parentId;

  if (!comment.text && !comment.recordingSrc) {
    // TODO: refactor error response here
    return res.status(400).json({ success: false, data: null });
  }

  await comment.save();

  const responseObject = {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId,
    username: res.locals.user.username,
    text: comment.text,
    recordingSrc: comment.recordingSrc,
    createdAt: comment.createdAt,
  };

  return res.status(201).json({
    success: true,
    data: responseObject,
  });
}

async function getPostComments(req, res, next) {
  const { postId } = req.params;
  const comments = await commentsService.getPostComments({ postId });
  return res.status(200).json({ success: true, data: comments });
}

async function downloadAudio(req, res, next) {
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
}

module.exports = {
  addComment,
  getPostComments,
  downloadAudio,
};
