const doctorModel = require("../models/doctor");
const userModel = require("../models/user");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    let model;
    const prototype = Object.getPrototypeOf(user);
    if (doctorModel.prototype === prototype) {
      model = "doctorModel";
    } else if (userModel.prototype === prototype) {
      model = "userModel";
    }
    const session = new CreateSession(user.id, model);
    done(null, session);
  });

  passport.deserializeUser(function (session, done) {
    console.log(session);
    if (session.model === "doctorModel") {
      doctorModel.findById(session.id, function (err, doctor) {
        return done(err, { role: "doctor", doctor });
      });
    } else if (session.model === "userModel") {
      userModel.findById(session.id, function (err, user) {
        return done(err, { role: "user", user });
      });
    }
  });

  function CreateSession(id, model) {
    return {
      id,
      model,
    };
  }
};
