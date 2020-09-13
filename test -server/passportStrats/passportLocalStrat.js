const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// *  Model route provided
const modelPath = "../models/user";
const routeName = "user";
const passport = require("passport");
const Model = require(modelPath);

passport.use(
  "user",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (loginDetails, password, done) => {
      // Find a document
      let foundDocument;

      foundDocument = await Model.findOne({ email: loginDetails }).exec();

      if (!foundDocument) {
        console.log(`No ${routeName} found`);
        return done(null, false, { message: "Invalid Credentials" });
      }

      bcrypt.compare(password, foundDocument.password, (err, isMatch) => {
        if (isMatch) {
          return done(null, foundDocument);
        } else {
          return done(null, false, {
            message: "Incorrect Credentials",
          });
        }
      });
    }
  )
);
