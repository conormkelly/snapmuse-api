const { DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/db');

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.STRING(36),
    defaultValue: () => uuidv4(),
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  postId: {
    type: DataTypes.STRING(36),
    references: {
      model: 'posts',
      key: 'id',
    },
    allowNull: false,
  },
  parentId: {
    type: DataTypes.STRING(36),
    defaultValue: null
  },
  userId: {
    type: DataTypes.STRING(36),
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  text: DataTypes.STRING(280),
  recordingSrc: DataTypes.STRING(100),
});

// Comment.belongsTo(Comment, { as: 'Parent' });
Comment.hasMany(Comment, {
  as: 'Children',
  foreignKey: 'parentId',
  useJunctionTable: false,
});

module.exports = Comment;
