module.exports = function (name, modelPath) {
  return `
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// *  Model route provided

const ${name}Model = require(${modelPath});

module.exports = function (passport) {
  passport.use(
    "${name}",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (loginDetails, password, done) => {
        // Find a document
        let ${name};
        console.log(loginDetails);
        if (loginDetails.includes("@")) {
          //better check
          // Find by email
          ${name} = await ${name}Model.findOne({ email: loginDetails }).exec();
          console.log(${name});
        } else {
          //better check
          //!
          // Find by phoneNo
          ${name} = await ${name}Model.findOne({
            phoneNo: parseInt(loginDetails),
          });
        }

        if (!${name}) {
          console.log(No ${name} found);
          return done(null, false, { message: "Invalid Credentials" });
        }

        bcrypt.compare(password, ${name}.password, (err, isMatch) => {
          if (isMatch) {
            return done(null, ${name});
          } else {
            return done(null, false, {
              message: "Incorrect Credentials",
            });
          }
        });
      }
    )
  );

  passport.serializeUser(function (${name}, done) {
    done(null, ${name});
  });

  passport.deserializeUser(function (id, done) {
    ${name}Model.findById(id, function (err, ${name}) {
      done(err, ${name});
    });
  });
};

`;
};
