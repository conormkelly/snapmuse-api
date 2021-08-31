const asyncHandler = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const postsService = require('../services/posts');

exports.loadPosts = asyncHandler(async (req, res, next) => {
  await postsService.load({ count: 10 });
  res.status(201).json({ success: true, message: 'Successfully added posts.' });
});

exports.getPostById = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postsService.findById(postId);
  if (!post) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Post not found.' })
    );
  }
  return res.status(200).json({ success: true, data: post });
});

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  // TODO: refactor this
  const now = new Date();
  now.setDate(now.getDate() - 7);
  const oneWeekAgo = now.toISOString();

  const resultSet = await postsService.getAll({ cutoffDate: oneWeekAgo });
  res.status(200).json({ success: true, data: resultSet });
});

exports.deleteAllPosts = asyncHandler(async (req, res, next) => {
  await postsService.deleteAll();
  res.status(200).json({ success: true, message: 'Deleted all posts!' });
});
