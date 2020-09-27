module.exports = function (name) {
  return `const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;

const ${name}Model = require("../models/${name}");

// * Settingup Passport github strategy
passport.use('${name}-facebook',
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/github/${name}/login/callback",
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
