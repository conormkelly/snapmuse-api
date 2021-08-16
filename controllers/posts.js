const ErrorResponse = require('../utils/ErrorResponse');

const postsService = require('../services/posts');

async function loadPosts(req, res, next) {
  await postsService.load({ count: 3 });
  res.status(200).json({ success: true, message: 'Successfully added posts.' });
}

async function getPostById(req, res, next) {
  const { postId } = req.params;

  const post = await postsService.findById(postId);
  if (!post) {
    return next(
      new ErrorResponse({ statusCode: 404, message: 'Post not found.' })
    );
  }
  return res.status(200).json({ success: true, data: post });
}

async function getAllPosts(req, res, next) {
  // Determine date 1 week ago
  const now = new Date();
  now.setDate(now.getDate() - 7);
  const oneWeekAgo = now.toISOString();

  const resultSet = await postsService.getAll({ cutoffDate: oneWeekAgo });
  res.status(200).json({ success: true, data: resultSet });
}

async function deleteAllPosts(req, res, next) {
  await postsService.deleteAll();
  return res.status(200).json({ success: true, message: 'Deleted all posts.' });
}

module.exports = {
  getAllPosts,
  getPostById,
  loadPosts,
  deleteAllPosts,
};
