const asyncHandler = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const postsService = require('../services/posts');

const ERROR_RESPONSE = {
  NOT_FOUND: new ErrorResponse({
    statusCode: 404,
    message: 'Post not found.',
  }),
};

exports.loadPosts = asyncHandler(async (req, res, next) => {
  await postsService.load({ count: 10 });
  res.status(201).json({ success: true, message: 'Successfully added posts.' });
});

exports.getPostById = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postsService.findById(postId);
  if (!post) {
    return next(ERROR_RESPONSE.NOT_FOUND);
  }
  return res.status(200).json({ success: true, data: post });
});

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  // Note: this is hardcoded to only fetch posts for the last 7 days
  const cutoffDate = new Date();
  const oneWeekAgo = cutoffDate.getDate() - 7;
  cutoffDate.setDate(oneWeekAgo);

  const resultSet = await postsService.getAll({ cutoffDate: oneWeekAgo });
  res.status(200).json({ success: true, data: resultSet });
});
