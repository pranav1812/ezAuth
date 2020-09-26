module.exports = function (name) {
  return `const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;

const ${name}Model = require("../models/${name}");

// * Settingup Passport google strategy
passport.use('${name}-google',
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/api/auth/google/${name}/login/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      let ${name} = await ${name}Model.findOne({ email: profile.email });
      if (!${name}) {
      
        ${name} = new ${name}Model({
          name: profile.displayName,
          email: profile.email
        });

        await ${name}.save();
      }
      done(null, ${name});
    }
  )
);
`;
};
//! ADD IN README -> HOW TO ADD CALLBACKS ON GOOGLE DEV CONSOLE
