function getCuratedPhotos() {
  return [
    {
      pexelsId: 1,
      title: 'Title1',
      createdAt: new Date().toISOString(),
      imageSrc: 'http://test.com/image1.jpg',
    },
    {
      pexelsId: 2,
      title: 'Title2',
      createdAt: new Date().toISOString(),
      imageSrc: 'http://test.com/image2.jpg',
    },
  ];
}

module.exports = { getCuratedPhotos };
