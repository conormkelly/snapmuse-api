// Pexels
const pexels = require('pexels');
const pexelsClient = pexels.createClient(process.env.PEXELS_API_KEY);
const Posts = require('../models/Post');

const axios = require('axios');

// Helper function
function toUppercase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function getCuratedPhotos({ count, pageSize }) {
  let existingPhotoIds = await Posts.find({}).select({ _id: 0, pexelsId: 1 });
  existingPhotoIds = new Set(existingPhotoIds.map((p) => p.pexelsId));

  const randomWords = await axios.get(
    `https://random-word-api.herokuapp.com/word?swear=0&number=${count}`
  );
  const pexelResponse = await pexelsClient.photos.curated({
    per_page: Math.max(pageSize, count),
  });

  const posts = [];
  for (const photo of pexelResponse.photos) {
    if (posts.length === count) {
      break;
    }
    if (!existingPhotoIds.has(photo.id)) {
      posts.push({
        pexelsId: photo.id,
        title: toUppercase(randomWords.data.pop()),
        createdAt: new Date().toISOString(),
        imageSrc: {
          large: photo.src.large,
          medium: photo.src.medium,
          small: photo.src.small,
        },
      });
    }
  }

  return posts;
}

module.exports = {
  getCuratedPhotos,
};
