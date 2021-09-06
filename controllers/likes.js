const asyncHandler = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const commentsService = require('../services/comments');
const likesService = require('../services/likes');

const ERROR_RESPONSE = {
  NOT_FOUND: new ErrorResponse({
    statusCode: 404,
    message: 'Comment not found.',
  }),
  INVALID_VALUE: new ErrorResponse({
    statusCode: 400,
    message: 'Value must be a boolean true or false.',
  }),
};

exports.upsert = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { value } = req.body;

  // Validate the value is a boolean
  if (typeof value !== "boolean") {
    return next(ERROR_RESPONSE.INVALID_VALUE);
  }

  const comment = await commentsService.findById(commentId);
  if (!comment) {
    return next(ERROR_RESPONSE.NOT_FOUND);
  }

  const wasSuccessful = await likesService.upsert({
    comment,
    userId: res.locals.user.id,
    value,
  });

  if (!wasSuccessful) {
    // This results in a 500 error, the error message will be logged
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
