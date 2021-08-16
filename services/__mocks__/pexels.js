const fakePexelsClient = {
  createClient: () => {
    return {
      photos: {
        curated: () => {
          return [
            { id: 1, src: { large: 'http://www.fake-image.com/image1.jpg' } },
            { id: 2, src: { large: 'http://www.fake-image.com/image2.jpg' } },
            { id: 3, src: { large: 'http://www.fake-image.com/image3.jpg' } },
          ];
        },
      },
    };
  },
};

module.exports = fakePexelsClient;
