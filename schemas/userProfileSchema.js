const mongoose = require("mongoose");

const mySchema = mongoose.Schema(
  {
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    password: String
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("loginpage", mySchema);
