// Mongoose
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: mongoose.Types.ObjectId,
    parentId: { type: mongoose.Types.ObjectId, default: null },
    userId: mongoose.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    text: String,
    recordingSrc: { type: String, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Comment', commentSchema);
