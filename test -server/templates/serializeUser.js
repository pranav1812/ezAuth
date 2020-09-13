module.exports = function (modelsList) {
  return `${reqModelsSttring(modelsList)}

    passport.serializeUser(function (user, done) {
        let model;
        const prototype = Object.getPrototypeOf(user);
       ${getModelCondition(modelsList)}
        const session = new CreateSession(user.id, model);
        done(null, session);
      });
  

      passport.deserializeUser(function (session, done) {
        ${getDeserilizeConditions(modelsList)}
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
      (m) =>
        (str += `const ${m.split("/")[modelsList.length]} = require('${m}')\n`)
    );
    return str;
  }

  function getModelCondition(modelsList) {
    let m = modelsList[0];
    let str = `if (${
      modelsList[0].split("/")[modelsList.length]
    }.prototype === prototype){
            model = "${m.split("/")[modelsList.length]}";
        }\n`;

    for (i = 1; i < modelsList.length; i++) {
      let m = modelsList[i];
      str += `        else if (${
        m.split("/")[modelsList.length]
      }.prototype === prototype){
                model = "${m.split("/")[modelsList.length]}";
        }\n`;
    }
    return str;
  }

  function getDeserilizeConditions(modelsList) {
    let m = modelsList[0];
    let str = `if (session.model === "${
      modelsList[0].split("/")[modelsList.length]
    }"){
    ${
      modelsList[0].split("/")[modelsList.length]
    }.findById(session.id, function (err, ${
      modelsList[0].split("/")[modelsList.length]
    }) {
        return done(err, { role: "${
          modelsList[0].split("/")[modelsList.length]
        }", ${modelsList[0].split("/")[modelsList.length]} });
      });      
}\n`;

    for (i = 1; i < modelsList.length; i++) {
      let m = modelsList[i];
      str += `        elseif (  session.model ===  "${
        m.split("/")[modelsList.length]
      }"){
        ${
          m.split("/")[modelsList.length]
        }.findById(session.id, function (err, ${
        m.split("/")[modelsList.length]
      }) {
            return done(err, { role: "${m.split("/")[modelsList.length]}", ${
        m.split("/")[modelsList.length]
      } });
          });      
    }\n`;
    }
    return str;
  }
  // };
};
