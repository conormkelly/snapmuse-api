const { Sequelize } = require('../config/db');

// Models
const Post = require('../models/Post');

const pexelsService = require('./pexels');

async function load({ count }) {
  // Get photos from the pexels API in Post model format
  const newPosts = await pexelsService.getCuratedPhotos({
    count,
    pageSize: 25,
  });

  await Post.bulkCreate(newPosts);
}

async function findById(postId) {
  return Post.findByPk(postId);
}

// TODO: hardcoded to just get from last week
async function getAll() {
  var cutoffDate = new Date();

  //Change it so that it is 7 days in the past.
  const oneWeekAgo = cutoffDate.getDate() - 7;
  cutoffDate.setDate(oneWeekAgo);

  return Post.findAll({
    order: [['createdAt', 'DESC']],
    where: { createdAt: { [Sequelize.Op.gte]: cutoffDate } },
  });
}

module.exports = {
  getAll,
  findById,
  load,
};
