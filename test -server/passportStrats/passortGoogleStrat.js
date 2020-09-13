const googleStrategy = require("passport-google-oauth2").Strategy;

// * Models
const Model = require("../models/user");

// * Settingup Passport google strategy
module.exports = function (passport) {
  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/googleAuth/login/callback",
      },
      async (req, accessToken, refreshToken, profile, done) => {
        let doc = await Model.findOne({ email: profile.email });
        if (!doc) {
          doc = new Model({
            name: profile.displayName,
            email: profile.email,
            googleId: profile.id,
            verified: true,
          });
          await doc.save();
        }
        done(null, doc);
      }
    )
  );
  passport.serializeUser((doc, done) => {
    done(null, doc.id);
  });
  passport.deserializeUser(async (id, done) => {
    const doc = await Model.findById(id);
    done(null, doc);
  });
};
