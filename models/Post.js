const { DataTypes, Sequelize, Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/db');

const Comment = require('./Comment');
const User = require('./User');

Comment.belongsTo(User);

const PostModel = sequelize.define('post', {
  id: {
    type: DataTypes.STRING(36),
    defaultValue: () => uuidv4(),
    unique: true,
    primaryKey: true,
    allowNull: false
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
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

// Add instance methods
class Post extends PostModel {
  async getComments() {
    const query = {
      where: { postId: this.id },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['username'] }],
    };

    const result = await Comment.findAll(query);

    // format raw data
    const parentCommentIndexMap = {};
    let currentIndex = 0;
    const comments = [];

    for (const rawComment of result) {
      const comment = {
        id: rawComment.id,
        postId: rawComment.postId,
        parentId: rawComment.parentId,
        username: rawComment.user.username,
        text: rawComment.text,
        recordingSrc: rawComment.recordingSrc,
        createdAt: rawComment.createdAt,
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
