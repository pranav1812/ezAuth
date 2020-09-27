
  const LocalStrategy = require("passport-local").Strategy;
  const bcrypt = require("bcryptjs");
  
  // *  Model route provided
  const passport = require("passport");
  const clientsModel = require('../models/clients');
  
  passport.use(
    "clients",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (loginDetails, password, done) => {
        // Find a document
        let clients;
  
        clients = await clientsModel.findOne({ email: loginDetails }).exec();
  
        if (!clients) {
          console.log(`No clients found`);
          return done(null, false, { message: "Invalid Credentials" });
        }
  
        bcrypt.compare(password, clients.password, (err, isMatch) => {
          if (isMatch) {
            return done(null, clients);
          } else {
            return done(null, false, {
              message: "Incorrect Credentials",
            });
          }
        });
      }
    )
  );
  
        