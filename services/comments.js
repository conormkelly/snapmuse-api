const Post = require('../models/Post');
const ErrorResponse = require('../utils/ErrorResponse');

async function addComment({ postId, comment }) {
  // // TODO: Validate postId etc
  // const newComment = new Comment({ postId, ...comment });
  // const result = await newComment.save();
  // return result;
  // TODO: THIS ISNT BEING USED!
}

async function getPostComments({ postId }) {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new ErrorResponse({ status: 404, message: 'Post not found.' });
  }
  return post.getComments();
}

module.exports = {
  addComment,
  getPostComments,
};
