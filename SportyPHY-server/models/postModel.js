const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      default: '',
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('post', postSchema);
module.exports = Post;
