
  const LocalStrategy = require("passport-local").Strategy;
  const bcrypt = require("bcryptjs");
  
  // *  Model route provided
  const passport = require("passport");
  const leadsModel = require('../models/leads');
  
  passport.use(
    "leads",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (loginDetails, password, done) => {
        // Find a document
        let leads;
  
        leads = await leadsModel.findOne({ email: loginDetails }).exec();
  
        if (!leads) {
          console.log(`No leads found`);
          return done(null, false, { message: "Invalid Credentials" });
        }
  
        bcrypt.compare(password, leads.password, (err, isMatch) => {
          if (isMatch) {
            return done(null, leads);
          } else {
            return done(null, false, {
              message: "Incorrect Credentials",
            });
          }
        });
      }
    )
  );
  
        