// Mongoose
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: mongoose.Types.ObjectId,
    username: String,
    createdAt: { type: Date, default: Date.now },
    text: { type: String, default: null },
    recordingSrc: { type: String, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Comment', commentSchema);
