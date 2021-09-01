const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new AWS.S3({ region: 'eu-west-1' });
// Configure AWS credentials
AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'eu-west-1',
});

const TEN_MB_IN_BYTES = 10000000;

// Generates a middleware function that is
// used to extract form fields from the multipart form
// and to upload the mp3 file to S3
const s3Uploader = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'audio/mpeg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file upload, only mp3 is allowed.'), false);
    }
  },
  storage: multerS3({
    acl: 'public-read',
    size: TEN_MB_IN_BYTES,
    s3,
    bucket: process.env.S3_AUDIO_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { userId: req.userId });
    },
    key: function (req, file, cb) {
      cb(null, req.filename);
    },
  }),
});

/**
 * Returns the file metadata and modifies req.body to include multipart form fields.
 */
function upload({ commentId, userId }, req, res) {
  req.filename = commentId;
  req.userId = userId;

  return new Promise((resolve, reject) => {
    s3Uploader.single('audio')(req, res, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(req.file);
      }
    });
  });
}

function getFileReadstream(commentId) {
  return s3
    .getObject({
      Bucket: process.env.S3_AUDIO_BUCKET_NAME,
      Key: commentId,
    })
    .createReadStream();
}

module.exports = { upload, getFileReadstream };
