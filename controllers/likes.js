const asyncHandler = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const commentsService = require('../services/comments');
const likesService = require('../services/likes');

exports.upsert = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { value } = req.body; // TODO: add validator

  const comment = await commentsService.findById(commentId);
  if (!comment) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Comment not found.' })
    );
  }

  const wasSuccessful = await likesService.upsert({
    comment,
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

exports.getAllUserLikes = asyncHandler(async (req, res, next) => {
  const allUserLikes = await likesService.getAllUserLikes(res.locals.user);
  return res.status(200).json({ success: true, data: allUserLikes });
});
