module.exports = function (name) {
  return `const passport = require("passport");
const gitHubStrategy = require("passport-github").Strategy;

const ${name}Model = require("../models/${name}");

// * Settingup Passport github strategy
passport.use('${name}-github',
  new gitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
