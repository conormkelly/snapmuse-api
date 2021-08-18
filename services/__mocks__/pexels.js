// For ensuring unique pexelsIds values
let count = 0;

function getCuratedPhotos() {
  return [
    {
      pexelsId: count++,
      title: 'Title1',
      createdAt: new Date().toISOString(),
      imageSrc: 'http://test.com/image1.jpg',
    },
    {
      pexelsId: count++,
      title: 'Title2',
      createdAt: new Date().toISOString(),
      imageSrc: 'http://test.com/image2.jpg',
    },
  ];
}

module.exports = { getCuratedPhotos };
