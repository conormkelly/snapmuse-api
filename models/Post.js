// Mongoose
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    pexelsId: Number,
    title: String,
    createdAt: Date,
    src: {
      large: { type: String },
      medium: { type: String },
      small: { type: String },
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Post', postSchema);
