const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;

const leadsModel = require("../models/leads");

// * Settingup Passport google strategy
passport.use('leads-google',
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/leads/login/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      let leads = await leadsModel.findOne({ email: profile.email });
      if (!leads) {
      
        leads = new leadsModel({
          name: profile.displayName,
          email: profile.email
        });

        await leads.save();
      }
      done(null, leads);
    }
  )
);
