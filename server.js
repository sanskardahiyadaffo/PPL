const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const user = require("./routers/router_user");
const router = require("./routers/router_main");
const post = require("./routers/router_PostUpload");
const category = require("./routers/router_Category");
const googleAuth = require("./routers/routerPassport");
const passport = require("passport");
const cookieSession = require("cookie-session");
const credentials = require("./keys");
// For external requests
app.use(require("cors")());
//For post request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["a"],
    maxAge: 1000 * 60 * 60 * 24
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Database Connection
const mongoose = require("mongoose");
mongoose.connect(
  credentials.mongoose.url2,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  //CB
  err => {
    if (err) console.log("Database Not Connected");
    else console.log("MongoDB Connected");
  }
);
//Main Routings
app.use("/user", user);
app.use("/post", post);
app.use("/auth", googleAuth);
app.use("/category", category);
//All extra routes
app.use("/", router);

//Listening to server
// const port = process.env.PORT || 8081;
const port = process.env.PORT || 8081;
// const hostname = "0.0.0.0";

// const hostname = '192.168.100.152';
const server = app.listen(port, () => {
  console.log(`Server is Running at port ${server.address().port}`);
});
