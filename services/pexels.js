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
  const existingPhotoIds = await Post.findAll({ attributes: ['pexelsId'] });
  const photoIdSet = new Set(existingPhotoIds.map((p) => p.pexelsId));

  // We only need a fixed amount of random words so one API call is all that is required
  const randomWords = await axios.get(
    `https://random-word-api.herokuapp.com/word?swear=0&number=${count}`
  );

  // Helper function to capitalize the randomly generated titles
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  // Keep calling Pexels service til we have enough unique photo posts
  const posts = [];
  let page = 1;
  while (posts.length !== count) {
    const pexelResponse = await pexelsClient.photos.curated({
      per_page: Math.max(pageSize, count, page),
    });

    for (const photo of pexelResponse.photos) {
      if (posts.length === count) {
        break;
      }
      if (!photoIdSet.has(photo.id)) {
        posts.push({
          pexelsId: photo.id,
          title: capitalize(randomWords.data.pop()),
          createdAt: new Date().toISOString(),
          imageSrc: photo.src.large,
        });
        photoIdSet.add(photo.id);
      }
    }
    // If page has been exhausted, go to the next one
    page += 1;
  }

  return posts;
}

module.exports = {
  getCuratedPhotos,
};
