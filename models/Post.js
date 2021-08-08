const { DataTypes, Sequelize, Op } = require('sequelize');
const sequelize = require('../config/db');

const Comment = require('./Comment');
const User = require('./User');

Comment.belongsTo(User);

const PostModel = sequelize.define('post', {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
    primaryKey: true,
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
  // imageSrcLarge: {
  //   type: DataTypes.STRING(100),
  //   allowNull: false,
  // },
  // imageSrcSmall: {
  //   type: DataTypes.STRING(100),
  //   allowNull: false,
  // },
});

// Add instance methods
class Post extends PostModel {
  async getComments(options = {}) {
    let query = {
      where: { postId: this.id },
      order: [['createdAt', 'DESC']],
    };

    if (options.afterId) {
      const lastComment = await Comment.findByPk(options.afterId);

      if (!lastComment) {
        throw new Error('No such doc!');
      } else {
        query = {
          where: {
            id: { [Op.ne]: lastComment.id },
            postId: this.id,
            createdAt: { [Op.gte]: lastComment.createdAt },
          },
        };
      }
    }
    query.include = [{ model: User, attributes: ['username'] }];

    const result = await Comment.findAll(query);
    return result;
  }
}

module.exports = Post;
