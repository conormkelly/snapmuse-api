// Models
const Post = require('../models/Post');

const pexelsService = require('./pexels');

// TODO: this API endpoint should only be callable by an admin user
async function loadPosts({ count }) {
  // Get photos from the pexels API in Post model format
  const newPosts = await pexelsService.getCuratedPhotos({
    count,
    pageSize: 25,
  });
  await Post.bulkCreate(newPosts);
}

async function getPostById(postId) {
  return Post.findByPk(postId);
}

async function getAllPosts({ cutoffDate }) {
  // TODO: manage cutoff date for posts
  return Post.findAll({
    order: [['createdAt', 'DESC']],
  });
}

async function deletePosts() {
  return Post.destroy({ where: {} });
}

module.exports = {
  getAllPosts,
  getPostById,
  loadPosts,
  deletePosts,
};
