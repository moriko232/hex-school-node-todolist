const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "名字必填"],
    },
    title: {
      type: String,
      required: [true, "標題必填"],
    },
    content: {
      type: String,
      required: [true, "內容必填"],
    },
    imgUrl: {
      type: String,
      required: false,
    },
    tag: {
      type: String,
      required: [true, "標籤必填"],
    },
    likes: {
      type: Number,
      default: 0,
      default: ""
    },
    comments: {
      type: Number,
      default: 0,
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { versionKey: false }
);
const Post = mongoose.model("post", postSchema);

module.exports = Post;
