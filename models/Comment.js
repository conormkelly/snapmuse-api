const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  postId: {
    type: DataTypes.UUID,
    references: {
      model: 'posts',
      key: 'id',
    },
    allowNull: false,
  },
  parentId: {
    type: DataTypes.UUID,
    defaultValue: null
  },
  userId: {
    type: DataTypes.UUID,
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
