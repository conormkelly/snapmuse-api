// Mongoose
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    pexelsId: { type: Number, select: false },
    title: String,
    createdAt: { type: Date, default: Date.now },
    imageSrc: {
      large: { type: String },
      medium: { type: String },
      small: { type: String },
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Post', postSchema);
