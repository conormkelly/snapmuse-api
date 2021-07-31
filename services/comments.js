const Comment = require('../models/Comment');
const mongoose = require('mongoose');

async function addComment({ postId, comment }) {
  // TODO: Validate postId etc
  const newComment = new Comment({ postId, ...comment });
  const result = await newComment.save();
  return result;
}

async function getPostComments({ postId }) {
  let results;
  if (mongoose.isValidObjectId(postId)) {
    results = await Comment.find({ postId }).sort({ createdAt: -1 });
  }
  return results;
}

module.exports = {
  addComment,
  getPostComments,
};
