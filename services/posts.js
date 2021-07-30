// Mongoose
const Post = require('../models/Post');
const mongoose = require('mongoose');

const pexelsService = require('./pexels');

// TODO: this API endpoint should only be callable by an admin user
async function loadPosts({ count }) {
  // Get photos from the pexels API in mongoose Post model format
  const newPosts = await pexelsService.getCuratedPhotos({
    count,
    pageSize: 25,
  });
  await Post.insertMany(newPosts);
}

async function getPostById(postId) {
  let post;
  if (mongoose.isValidObjectId(postId)) {
    post = await Post.findOne({ _id: postId });
  }

  return post;
}

async function getAllPosts({ cutoffDate }) {
  const response = await Post.find({
    createdAt: { $gte: cutoffDate },
  }).sort({ createdAt: -1 });

  return response;
}

async function deletePosts() {
  await Post.deleteMany({});
}

module.exports = {
  getAllPosts,
  getPostById,
  loadPosts,
  deletePosts,
};
