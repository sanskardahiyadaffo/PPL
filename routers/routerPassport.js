const passport = require("passport");
const passportGoogle = require("passport-google-oauth20");
const router = require("express").Router();
const myDB = require("../schemas/userProfileSchema");
const credentials = require("../keys").google;
let data = false;
router.all("/user", (req, res) => {
  try {
    // req.logOut();
    res.send(data || false);
    data = false;
  } catch (err) {
    console.log(err, "ERROR");
    res.send(false);
  }
});
router.route("/google").get(
  (req, res, next) => {
    console.log("Google Login is clicked");
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);
router.get("/error", () => {
  console.log("Google signin error");
});

router
  .route("/google/CB")
  .get(
    passport.authenticate("google", { failureRedirect: "/auth/error" }),
    (req, res) => {
      console.log("Login Sucessful");
      res.send(`<script>
      window.close();
      </script>`);
    }
  );

passport.serializeUser((user, done) => {
  //   console.log("Serial");
  data = user;
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  //   console.log(user, "Deserial");
  done(null, user);
});

passport.use(
  new passportGoogle(
    {
      callbackURL: "/auth/google/CB",
      clientID: credentials.id,
      clientSecret: credentials.secret
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log('Access>', accessToken)
      // console.log('refresh>', refreshToken)
      // console.log("profile>", profile);
      // return 0;
      // console.log('callback function of passport-google');
      let user = {
        username: profile.emails[0].value,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        password: profile.id,
        phone: -1,
        photo: profile.photos[0].value
      };
      //   console.log(user, "user_Data");
      let mydata = user;
      try {
        mydata = await myDB.find({ email: user.username });
        if (mydata.length == 0) {
          mydata = await myDB.create(user);
        }
        mydata = await myDB.find({ email: user.username });
        mydata = mydata[0];
        console.log(mydata, "mydata");
      } catch (error) {
        console.log(error, "erroror");
      }
      done(null, mydata);
    }
  )
);

module.exports = router;
