const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const doctorModel = require("../models/doctor");

const passport = require("passport");
// module.exports = function (passport) {
passport.use(
  "doctor",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (loginDetails, password, done) => {
      // Find a document
      let doctor;
      doctor = await doctorModel.findOne({ email: loginDetails }).exec();
      if (!doctor) {
        console.log("No doctor found");
        return done(null, false, { message: "Invalid Credentials" });
      }

      bcrypt.compare(password, doctor.password, (err, isMatch) => {
        if (isMatch) {
          return done(null, doctor);
        } else {
          return done(null, false, {
            message: "Incorrect Credentials",
          });
        }
      });
    }
  )
);
