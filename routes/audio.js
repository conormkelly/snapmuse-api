const express = require('express');
const audioRouter = express.Router();

// Controller methods
// TODO: move this to a different controller
const { downloadAudio } = require('../controllers/comments');

// File download
audioRouter.get('/:commentId', downloadAudio);

module.exports = audioRouter;
