const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new AWS.S3({ region: 'eu-west-1' });

// Configure AWS credentials
AWS.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: 'eu-west-1',
});

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
    s3,
    bucket: process.env.S3_AUDIO_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { username: req.username });
    },
    key: function (req, file, cb) {
      cb(null, req.audioFilename);
    },
  }),
});

/**
 * Returns the file metadata and modifies req.body to include multipart form fields.
 */
function upload({ commentId, username }, req, res) {
  req.audioFilename = commentId;
  req.username = username;

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

module.exports = { upload };
