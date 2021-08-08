const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  postId: {
    type: Sequelize.UUIDV4,
    references: {
      model: 'posts',
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: Sequelize.UUIDV4,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  text: DataTypes.STRING(280),
  recordingSrc: DataTypes.STRING(100),
});

module.exports = Comment;
