// Mongoose
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: mongoose.Types.ObjectId,
    parentId: mongoose.Types.ObjectId | null,
    userId: mongoose.Types.ObjectId,
    createdAt: Date,
    text: String,
    recordingSrc: String | null,
  },
  { versionKey: false }
);

module.exports = mongoose.model('Comment', commentSchema);
