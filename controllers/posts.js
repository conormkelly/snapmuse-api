const postsService = require('../services/posts');

async function loadPosts(req, res, next) {
  await postsService.loadPosts({ count: 3 });
  res.status(200).json({ success: true, message: 'Successfully added posts.' });
}

async function getAllPosts(req, res, next) {
  // Determine date 1 week ago
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const oneWeekAgo = cutoff.toISOString();

  const resultSet = await postsService.getAllPosts({ cutoffDate: oneWeekAgo });

  res.status(200).json(resultSet);
}

async function deleteAllPosts(req, res, next) {
  await postsService.deletePosts();
  return res.status(200).json({ success: true, message: 'Deleted all posts.' });
}

module.exports = {
  getAllPosts,
  loadPosts,
  deleteAllPosts,
};
