const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const UserLike = sequelize.define('likes', {
  postId: {
    type: DataTypes.UUID,
    references: {
      model: 'posts',
      key: 'id',
    },
    allowNull: false,
    primaryKey: true,
  },
  commentId: {
    type: DataTypes.UUID,
    references: {
      model: 'comments',
      key: 'id',
    },
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
    primaryKey: true,
  },
  isLiked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = UserLike;
