// Mongoose
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    pexelsId: Number,
    title: String,
    createdAt: Date,
    imageSrc: {
      large: { type: String },
      medium: { type: String },
      small: { type: String },
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Post', postSchema);
