const express = require("express");
const router = express.Router();
const api = require("../apis/api");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "views/profilePictures");
  },
  filename: function(req, file, cb) {
    try {
      let removalPath = `${__dirname
        .toString()
        .slice(0, -7)}views/profilePictures/${req.cookies.MyCookie.photo}`;
      require("fs").unlinkSync(removalPath);
      // console.log('mypath>>>', removalPath);
    } catch (err) {
      // console.log('errr>>>>', err);
    }
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

/******************** FOR ROUTER API'S **********************************/

router.route("/login").post(upload.none(), async (req, res) => {
  try {
    // Capture Data
    // console.log(req.body);
    let outputdata = await api.getdata(req.body);
    console.log("Post Call for /loginAPI");
    res.send({
      status: true,
      data: outputdata
    });
  } catch (err) {
    if (err.name === "Password-MisMatch") res.send(err);
    else
      res.send({
        status: false,
        data: err
      });
  }
});

router.route("/validate").post(upload.none(), async (req, res) => {
  try {
    // Capture Data
    let outputdata = await api.getValidation(req.body.value, req.body.name);
    res.send({
      status: true,
      data: outputdata
    });
  } catch (err) {
    res.send({
      status: false,
      data: err
    });
  }
});
router.route("/getbyId").get(async (req, res) => {
  try {
    // Capture Data
    let outputdata = await api.getUserById(req.query._id);
    res.send({
      status: true,
      data: outputdata
    });
  } catch (err) {
    res.send({
      status: false,
      data: err
    });
  }
});

router.route(`/registration`).post(upload.any(), async (req, res) => {
  try {
    // console.log('uploaded image is at', req.files || 'No Image Found');
    // Get Data
    let userdata = req.body;
    userdata.firstname = userdata["first name"] || userdata.firstname;
    userdata.lastname = userdata["last name"] || userdata.lastname;
    console.log(userdata, "<<<<<<<regostration");
    try {
      if (req.files) {
        userdata.photo = req.files[0].filename;
      }
    } catch (err) {}
    if (userdata.username && userdata.password && userdata.email) {
      await api.getValidation(userdata.username, "username");
      await api.getValidation(userdata.email, "email");
      let output = await api.adduser(userdata);
      console.log("Registration Done ", output);
      // Creating Cookie
      res.send({
        status: true,
        data: output
      });
    } else {
      res.send({
        status: false,
        data: "No Data Found"
      });
    }
  } catch (err) {
    console.log("Data Validation Failed at database", err);
    res.send({
      status: false,
      data: err
    });
  }
});

module.exports = router;
