module.exports = function (authRoutes) {
  return `const passport = require("passport");
  ${reqModelsSttring(authRoutes)}

    passport.serializeUser(function (user, done) {
        let model;
        const prototype = Object.getPrototypeOf(user);
       ${getModelCondition(authRoutes)}
        const session = new CreateSession(user.id, model);
        done(null, session);
      });
  

      passport.deserializeUser(function (session, done) {
        ${getDeserilizeConditions(authRoutes)}
      });


      function CreateSession(id, model) {
        return {
          id,
          model,
        };
      }
      `;

  function reqModelsSttring(modelsList) {
    let str = "";

    modelsList.forEach(
      (m) => (str += `const ${m} = require('../models/${m}')\n`)
    );
    return str;
  }

  function getModelCondition(modelsList) {
    let m = modelsList[0];
    let str = `if (${modelsList[0]}.prototype === prototype){
            model = "${m}";
        }\n`;

    for (i = 1; i < modelsList.length; i++) {
      let m = modelsList[i];
      str += `        else if (${m}.prototype === prototype){
                model = "${m}";
        }\n`;
    }
    return str;
  }

  function getDeserilizeConditions(modelsList) {
    let m = modelsList[0];
    let str = `if (session.model === "${modelsList[0]}"){
    ${modelsList[0]}.findById(session.id, function (err, ${modelsList[0]}) {
        return done(err, { role: "${modelsList[0]}", ${modelsList[0]} });
      });      
}\n`;

    for (i = 1; i < modelsList.length; i++) {
      let m = modelsList[i];
      str += `        else if (  session.model ===  "${m}"){
        ${m}.findById(session.id, function (err, ${m}) {
            return done(err, { role: "${m}", ${m} });
          });      
    }\n`;
    }
    return str;
  }
  // };
};
