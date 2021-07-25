async function getAllPosts(req, res, next) {
  res.status(200).json([1, 2, 3]);
}

module.exports = {
  getAllPosts,
};
