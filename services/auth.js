const User = require('../models/User');

function createUser({ username, password }) {
  return User.create({ username, password });
}

function findUserByUsername(username) {
  return User.findOne({ where: { username } });
}

function findUserById(userId) {
  return User.findByPk(userId);
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};
