const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = sequelize.define('user', {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
    primaryKey: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    is: /^[0-9a-z_-]$/i,
  },
  password: {
    type: DataTypes.STRING(60),
    is: /^[0-9a-f]{60}$/i,
    allowNull: false,
  },
});

UserModel.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Add instance methods
class User extends UserModel {
  static async isRegistered(username) {
    return User.findOne({ where: { username } });
  }

  /**
   * Generates a JWT token for the user.
   * @returns {string}
   */
  getToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_DAYS,
    });
  }

  /**
   * Validate that the supplied password matches the stored salted hash.
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isCorrectPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
