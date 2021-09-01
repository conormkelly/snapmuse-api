// Pexels
const pexels = require('pexels');
const pexelsClient = pexels.createClient(process.env.PEXELS_API_KEY);
const Post = require('../models/Post');

const axios = require('axios');

/**
 * Retrieves `count` number of unique Pexels photos from the service,
 * with corresponding randomly generated titles.
 */
async function getCuratedPhotos({ count, pageSize }) {
  let existingPhotoIds = await Post.findAll();
  existingPhotoIds = new Set(existingPhotoIds.map((p) => p.pexelsId));

  const randomWords = await axios.get(
    `https://random-word-api.herokuapp.com/word?swear=0&number=${count}`
  );
  const pexelResponse = await pexelsClient.photos.curated({
    per_page: Math.max(pageSize, count),
  });

  // Helper function to capitalize the randomly generated titles
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const posts = [];
  for (const photo of pexelResponse.photos) {
    if (posts.length === count) {
      break;
    }
    if (!existingPhotoIds.has(photo.id)) {
      posts.push({
        pexelsId: photo.id,
        title: capitalize(randomWords.data.pop()),
        createdAt: new Date().toISOString(),
        imageSrc: photo.src.large,
      });
    }
  }

  return posts;
}

module.exports = {
  getCuratedPhotos,
};
