const commentsService = require('../services/comments');

async function addComment(req, res, next) {
  const { postId } = req.params;
  const comment = req.body;

  const result = await commentsService.addComment({ postId, comment });
  return res.status(201).json(result);
}

async function getPostComments(req, res, next) {
  const { postId } = req.params;
  const comments = await commentsService.getPostComments({ postId });
  return res.status(200).json({ success: true, comments });
}

module.exports = {
  addComment,
  getPostComments,
};
