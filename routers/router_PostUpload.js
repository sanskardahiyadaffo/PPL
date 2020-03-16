const express = require("express");
const router = express.Router();
const api = require("../apis/postApis");
const userApi = require("../apis/api");
const multer = require("multer");
const getMyMonth = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
let myUploadPath =
  __dirname.split("PPL_Backend")[0] + "PPL_React_REDUX/public/postUpload";
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

// var upload = multer({ dest: 'views/uploads/' })

/************************************************************************/
/******************** FOR ROUTER API'S **********************************/
/************************************************************************/

router.route("/upload").post(upload.any(), async (req, res) => {
  try {
    // Capture Data
    let postData = req.body;
    postData.postImage = req.files[0].filename;
    let d = new Date();
    //Setting Date
    postData.postDate =
      (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) +
      " " +
      getMyMonth[d.getMonth()] +
      " " +
      d.getFullYear();
    //Setting Time
    if (d.getHours() < 12)
      postTime =
        "" +
        (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) +
        ":" +
        (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) +
        "am";
    else
      postTime =
        "" +
        (d.getHours() - 12 < 10
          ? "0" + (d.getHours() - 12)
          : d.getHours() - 12) +
        ":" +
        (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) +
        "pm";
    postData.postTime = postTime;

    postData = await api.addUserPost(postData);
    // console.log(postData);
    res.send("true");
  } catch (err) {}
});
let i = 1;
router.route("/getpost").all(upload.none(), async (req, res) => {
  try {
    // Capture Data
    console.log("Getting data  " + i++);
    let postData = await api.getAllPost();
    if (req.query._id) {
      postData = postData.filter(
        ele => ele._id.toString() === req.query._id.toString()
      );
      console.log(req.query._id, "<<<Filtered data is >>>", postData);
    }
    res.send(postData);
  } catch (err) {
    // console.log(err);
    res.send("error");
  }
});

router.post("/updatepost", async (req, res) => {
  try {
    let recivedData = req.body;
    // console.log(recivedData, "This is Update");
    await api.updateUserPost({ _id: req.body._id }, { $set: req.body.value });
    res.send("true");
  } catch (err) {
    res.send("false");
  }
});

router.all("/postbypagenumber", async (req, res) => {
  try {
    const page = req.query.page || 0;
    const data = await api.getAllPost();
    console.log(page, data);
    res.send("true");
  } catch (err) {
    console.log(err, "eeeoeoee");
    res.send("false");
  }
});
module.exports = router;
