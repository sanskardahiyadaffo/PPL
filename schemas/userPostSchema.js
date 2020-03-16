const mongoose = require("mongoose");

const mySchema = mongoose.Schema(
  {
    userid: String,
    title: { type: String, default: "This is My Post" },
    categoryName: { type: String, default: "OTHERS" },
    userName: String,
    postImage: String,
    postDate: {
      type: String,
      default:
        "" +
        new Date().getDay() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getFullYear()
    },
    postTime: {
      type: String,
      default: "" + new Date().getHours() + ":" + new Date().getMinutes()
    },
    allLikes: { type: Array, default: [] },
    allUnlikes: { type: Array, default: [] },
    allFlags: { type: Array, default: [] },
    comments: { type: Array, default: [] }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("postupload", mySchema);
