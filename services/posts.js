// Mongoose
const Post = require('../models/Post');

const pexelsService = require('./pexels');

// TODO: this API endpoint should only be callable by an admin user
async function loadPosts({ count }) {
  // Get photos from the pexels API in mongoose Post model format
  const newPosts = await pexelsService.getCuratedPhotos({ count });
  await Post.insertMany(newPosts);
}

async function getAllPosts({ cutoffDate }) {
  const response = await Post.find({
    createdAt: { $gte: cutoffDate },
  });

  return response;
}

async function deletePosts() {
  await Post.deleteMany({});
}

module.exports = {
  getAllPosts,
  loadPosts,
  deletePosts,
};
