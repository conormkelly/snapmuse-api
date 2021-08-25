const { DataTypes, Sequelize, Op, UUIDV4 } = require('sequelize');
const sequelize = require('../config/db');

const Comment = require('./Comment');
const User = require('./User');
const UserLike = require('./UserLike');

Comment.belongsTo(User);

const PostModel = sequelize.define('post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  pexelsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  imageSrc: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
});

// Add instance methods
class Post extends PostModel {
  async getComments(userId) {
    // Get all posts that the user has liked
    const userLikesQuery = {
      where: { userId, postId: this.id },
    };

    const commentsQuery = {
      where: { postId: this.id },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['username'] }],
    };

    const [userLikes, rawComments] = await Promise.all([
      UserLike.findAll(userLikesQuery),
      Comment.findAll(commentsQuery),
    ]);

    const likedComments =
      userLikes && userLikes.length
        ? userLikes.reduce((acc, val) => {
            acc.set(val.commentId, val.isLiked);
            return acc;
          }, new Map())
        : new Map();

    // format raw data
    const parentCommentIndexMap = {};
    let currentIndex = 0;
    const comments = [];

    for (const rawComment of rawComments) {
      const comment = {
        id: rawComment.id,
        postId: rawComment.postId,
        parentId: rawComment.parentId,
        username: rawComment.user.username,
        text: rawComment.text,
        recordingSrc: rawComment.recordingSrc,
        createdAt: rawComment.createdAt,
        isLiked: likedComments.get(rawComment.id) || false,
        children: [],
      };

      // Its a top-level comment
      if (comment.parentId === null) {
        comments.push(comment);
        parentCommentIndexMap[comment.id] = currentIndex;
        currentIndex += 1;
      } else {
        const parentIndex = parentCommentIndexMap[comment.parentId];
        comments[parentIndex].children.push(comment);
      }
    }

    return comments;
  }
}

module.exports = Post;
