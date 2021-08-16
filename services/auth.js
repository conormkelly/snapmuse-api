const User = require('../models/User');

async function isUsernameRegistered(username) {
  return User.isRegistered(username);
}

async function createUser({ username, password }) {
  return User.create({ username, password });
}

async function findUserByUsername(username) {
  return User.findOne({ where: { username } });
}

async function findUserById(userId) {
  return User.findByPk(userId);
}

module.exports = {
  isUsernameRegistered,
  createUser,
  findUserByUsername,
  findUserById,
};
