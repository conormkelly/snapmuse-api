const postsService = require('../services/posts');

async function loadPosts(req, res, next) {
  await postsService.loadPosts({ count: 3 });
  res.status(200).json({ success: true, message: 'Successfully added posts.' });
}

async function getPostById(req, res, next) {
  const { postId } = req.params;

  const post = await postsService.getPostById(postId);
  if (!post) {
    return res.status(404).json({ success: false, data: null });
  }
  return res.status(200).json({ success: true, data: post });
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
  getPostById,
  loadPosts,
  deleteAllPosts,
};
