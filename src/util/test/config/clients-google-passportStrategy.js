const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;

const clientsModel = require("../models/clients");

// * Settingup Passport google strategy
passport.use('clients-google',
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/clients/login/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      let clients = await clientsModel.findOne({ email: profile.email });
      if (!clients) {
      
        clients = new clientsModel({
          name: profile.displayName,
          email: profile.email
        });

        await clients.save();
      }
      done(null, clients);
    }
  )
);
