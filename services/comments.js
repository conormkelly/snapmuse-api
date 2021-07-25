const Comment = require('../models/Comment');

async function addComment({ postId, comment }) {
  // TODO: Validate postId etc
  const newComment = new Comment({ postId, ...comment });
  const result = await newComment.save();
  return result;
}

async function getPostComments({ postId }) {
  const results = await Comment.find({ postId });
  return results;
}

module.exports = {
  addComment,
  getPostComments,
};
