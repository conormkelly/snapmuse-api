const Post = require('../models/Post');
const Comment = require('../models/Comment');

const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Returns an unsaved Comment.
 * @returns {Comment}
 */
function build({ postId, userId }) {
  return Comment.build({
    postId,
    userId,
    text: null,
    parentId: null,
    recordingSrc: null,
  });
}

async function getPostComments({ postId }) {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new ErrorResponse({ status: 404, message: 'Post not found.' });
  }
  return post.getComments();
}

module.exports = {
  build,
  getPostComments,
};
