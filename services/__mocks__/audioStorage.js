function upload({ commentId, userId }, req, res) {
  req.filename = commentId;
  req.userId = userId;

  return new Promise((resolve, reject) => {
    if (commentId === 'fail') {
      reject(new Error('File upload failed'));
    } else {
      req.file = { location: 'http://some-s3-bucket.aws.com/test.mp3' };
      resolve(req.file);
    }
  });
}

function getFileReadstream(commentId) {
  return {};
}

module.exports = { upload, getFileReadstream };
