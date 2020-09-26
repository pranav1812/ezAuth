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
  

      passport.deserializeUser(async function (session, done) {
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
      (m) => (str += `const ${m}Model = require('../models/${m}')\n`)
    );
    return str;
  }

  function getModelCondition(modelsList) {
    let m = modelsList[0];
    let str = `if (${modelsList[0]}Model.prototype === prototype){
            model = "${m}";
        }\n`;

    for (i = 1; i < modelsList.length; i++) {
      let m = modelsList[i];
      str += `        else if (${m}Model.prototype === prototype){
                model = "${m}";
        }\n`;
    }
    return str;
  }

  function getDeserilizeConditions(modelsList) {
    let m = modelsList[0];
    let str = `if (session.model === "${modelsList[0]}"){
    const user = await ${modelsList[0]}Model.findById(session.id);   
    user.role= "${m}";   
    return done(false,user);
}\n`;

    for (i = 1; i < modelsList.length; i++) {
      let m = modelsList[i];
      str += `        else if (  session.model ===  "${m}"){
        const user = await ${m}Model.findById(session.id);  
        user.role= "${m}";     
        return done(false,  user );
    }\n`;
    }
    return str;
  }
};
