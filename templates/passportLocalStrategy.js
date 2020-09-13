module.exports = function (name, modelPath) {
  return `
  const LocalStrategy = require("passport-local").Strategy;
  const bcrypt = require("bcryptjs");
  
  // *  Model route provided
  const passport = require("passport");
  const ${name}Model = require('${modelPath}');
  
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
  
        ${name} = await ${name}Model.findOne({ email: loginDetails }).exec();
  
        if (!${name}) {
          console.log(\`No ${name} found\`);
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
  
        `;
};
