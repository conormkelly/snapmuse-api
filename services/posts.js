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
async function getAll(params) {
  const whereClause =
    params && params.cutoffDate
      ? { createdAt: { [Sequelize.Op.gte]: params.cutoffDate } }
      : {};
  return Post.findAll({
    order: [['createdAt', 'DESC']],
    where: whereClause,
  });
}

module.exports = {
  getAll,
  findById,
  load,
};
