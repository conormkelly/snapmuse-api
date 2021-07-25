// Pexels
const pexels = require('pexels');
const pexelsClient = pexels.createClient(process.env.PEXELS_API_KEY);

// Helper function
function generateTitle(url) {
  const title = url.split('https://www.pexels.com/photo/')[1].split('-')[0];
  return title.charAt(0).toUpperCase() + title.slice(1);
}

async function getCuratedPhotos({ count }) {
  const pexelResponse = await pexelsClient.photos.curated({ per_page: count });
  const posts = pexelResponse.photos.map((photo) => {
    return {
      id: photo.id,
      title: generateTitle(photo.url),
      createdAt: new Date().toISOString(),
      src: {
        large: photo.src.large,
        medium: photo.src.medium,
        small: photo.src.small,
      },
    };
  });

  return posts;
}

module.exports = {
  getCuratedPhotos,
};
