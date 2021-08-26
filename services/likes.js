const Comment = require('../models/Comment');
const UserLike = require('../models/UserLike');

function upsert({ comment, userId, value }) {
  return UserLike.upsert({
    commentId: comment.id,
    postId: comment.postId,
    userId,
    isLiked: value,
  });
}

async function getAllUserLikes(user) {
  const userLikes = await UserLike.findAll({
    where: { userId: user.id, isLiked: true },
    order: [['updatedAt', 'DESC']],
    include: [{ model: Comment }],
  });

  if (userLikes && userLikes.length) {
    return userLikes.map((userLike) => {
      return {
        id: userLike.comment.id,
        postId: userLike.comment.postId,
        parentId: userLike.comment.parentId,
        username: user.username,
        text: userLike.comment.text,
        recordingSrc: userLike.comment.recordingSrc,
        createdAt: userLike.comment.createdAt,
        isLiked: true,
        children: [],
      };
    });
  } else {
    return [];
  }
}

module.exports = {
  upsert,
  getAllUserLikes,
};
