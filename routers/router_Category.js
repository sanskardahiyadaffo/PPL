const express = require("express");
const router = express.Router();
const api = require("../apis/categries");
const multer = require("multer");
let myUploadPath =
  __dirname.split("PPL_Backend")[0] + "PPL_React/public/CategoriesPhotos";
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, myUploadPath);
  },
  filename: function(req, file, cb) {
    let indx = file.mimetype.search("/");
    cb(
      null,
      `${Math.random()
        .toString()
        .substr(2)}${Date.now()}.${file.mimetype.substr(indx + 1)}`
    );
  }
});

const upload = multer({ storage: storage });

/************************************************************************/
/******************** FOR ROUTER API'S **********************************/
/************************************************************************/

router.route("/add1").post(async (req, res) => {
  try {
    // Capture Data
    let postData = req.body;
    await api.addCategories(postData);
    res.send("true");
  } catch (err) {
    s;
    res.send("false");
  }
});
router.route("/add").post(upload.any(), async (req, res) => {
  try {
    // Capture Data
    let postData = Object.assign({}, req.body);
    delete postData._id;
    postData.name = postData.name.toUpperCase();
    postData.imgUrl = "/CategoriesPhotos/" + req.files[0].filename;
    let output = await api.updateCategories(
      { _id: req.body._id },
      { $push: { myCategories: { $each: [postData] } } }
    );
    res.send("true");
  } catch (err) {
    console.log(err, "<><<<<<");
    res.send("false");
  }
});

router.route("/get").all(async (req, res) => {
  try {
    // Capture Data
    let postData = await api.getAllCategories();
    // console.log(postData);
    res.send(postData);
  } catch (err) {
    res.send("false");
  }
});

module.exports = router;
