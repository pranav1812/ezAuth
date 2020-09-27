const passport = require("passport");
  const leadsModel = require('../models/leads')
const clientsModel = require('../models/clients')


    passport.serializeUser(function (user, done) {
        let model;
        const prototype = Object.getPrototypeOf(user);
       if (leadsModel.prototype === prototype){
            model = "leads";
        }
        else if (clientsModel.prototype === prototype){
                model = "clients";
        }

        const session = new CreateSession(user.id, model);
        done(null, session);
      });
  

      passport.deserializeUser(async function (session, done) {
        if (session.model === "leads"){
    const user = await leadsModel.findById(session.id); 
    if(!user)done(true); 
    user.role= "leads";   
    return done(false,user);
}
        else if (  session.model ===  "clients"){
        const user = await clientsModel.findById(session.id);
        if(!user)done(true);  
        user.role= "clients";     
        return done(false,  user );
    }

      });


      function CreateSession(id, model) {
        return {
          id,
          model,
        };
      }
      