const mongoose = require("mongoose");

const mySchema = mongoose.Schema(
  {
    myCategories: {
      type: Array,
      default: []
    }
  },
  {
    versionKey: false
  }
);
//Extra details are like Categories...etc
module.exports = mongoose.model("ExtraDetails", mySchema);
