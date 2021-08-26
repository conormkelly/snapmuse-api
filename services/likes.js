const UserLike = require('../models/UserLike');

function upsert({ comment, userId, value }) {
  return UserLike.upsert({
    commentId: comment.id,
    postId: comment.postId,
    userId,
    isLiked: value,
  });
}

function getAllUserLikes({ userId }) {
  return UserLike.findAll({
    where: { userId },
  });
}

module.exports = {
  upsert,
  getAllUserLikes,
};
