// functions for actions
const { prompt } = require("inquirer");
const questions = require("./cliQuestions");
const fileFunctions = require("./fileFunctions");
const init = require("./tool");
const installObj= require('./installObj')

var cliFunctions = {};
module.exports = cliFunctions;

cliFunctions.runFunction = () => {
  var install=[]
  installObj.backend.standard.forEach(obj=> install.push(obj))

  prompt(questions.runQuestions).then(async (answers) => {
    // tool(answers.models.split(' '), answers.authModels.split(' ') )
    var pass = false;
    if (answers.npmInit) {
      var npmAnswers = await prompt(questions.npmQuestions);
      fileFunctions.packageJson(npmAnswers);
    } else {
      pass = true;
    }
    var providerNames = [];
    var providerData = [];
    if (pass || npmAnswers) {
      for (var i = 0; i < answers.providers.length; i++) {
        console.log(`\n ${answers.providers[i]} config \n`);
        var wait = await prompt(questions.providerQuestions);
        providerNames.push(answers.providers[i].toLowerCase());
        providerData.push(wait);
      }
    }

    if(providerNames.length){
      providerNames.forEach(obj=> {
        installObj.backend[obj].forEach(ins=> install.push(ins))
      })
    }

    if (answers.emailAuth) {
      var emailConfig = await prompt(questions.nodemailer);
      providerNames.push("local");
      providerData.push(emailConfig);

      installObj.backend.email.forEach(ins=> install.push(ins))
    }

    var configObj = {
      MONGODB_URI: answers.mongoUrl,
      PORT: 3000,
      SMTP_USER: providerData[providerData.length - 1].email_id,
      SMTP_PASS: providerData[providerData.length - 1].password,
      SMTP_HOST: providerData[providerData.length - 1].service,
    };
    for (var i = 0; i < answers.providers.length; i++) {
      var tempId = answers.providers[i].toUpperCase() + "_CLIENT_ID";
      var tempSec = answers.providers[i].toUpperCase() + "_CLIENT_SECRET";
      configObj[tempId] = providerData[i].clientId;
      configObj[tempSec] = providerData[i].clientSecret;
    }
    // console.log(install)
    
    init(
      answers.unAuthRoutes.split(" "),
      answers.authRoutes.split(" "),
      providerNames,
      configObj,
      answers.staticFrontend,
      process.cwd(),
      install
    );
  });
};


cliFunctions.reactFunction = () => {
  var install= []
  installObj.react.standardCsr.forEach(ins=> install.push(ins))
  prompt(questions.reactSetup).then(async (answers) => {
    var reactObj={
        redux: false,
        routing: false
    }
    if(answers.routing){
        var routeAnswers= await prompt(questions.reactRouting)
        reactObj.routing= routeAnswers.routes.split(' ')

        installObj.react.routing.forEach(ins=> install.push(ins))

        fileFunctions.reactFirebaseSetup(reactObj, false, answers.projectName, install)
    }else{
        fileFunctions.reactFirebaseSetup(reactObj, false, answers.projectName, install)
    }
    //console.log(install)
  });
};

cliFunctions.reactFirebaseFunction = async () => {
  var install= []
  installObj.react.standardCsr.forEach(ins=> install.push(ins))
  installObj.firebase.forEach(ins=> install.push(ins))

  var reactSetupAnswers = await prompt(questions.reactSetup);
  var reactObj= {
    redux: false,
    routing: false
  }
  if(reactSetupAnswers.routing){
      installObj.react.routing.forEach(ins=> install.push(ins))
      var routeAnswers= await prompt(questions.reactRouting)
      reactObj.routing= routeAnswers.routes.split(' ')
  }

  
  var firebaseAnswers = await prompt(questions.firebaseSetup);
  var firebaseObj= {
        firestore: firebaseAnswers.services.includes('firestore'),
        auth: firebaseAnswers.services.includes('authentication'),
        storage: firebaseAnswers.services.includes('storage'),
        analytics: firebaseAnswers.services.includes('analytics')
    }
  // console.log(install)
  fileFunctions.reactFirebaseSetup(reactObj, firebaseObj, reactSetupAnswers.projectName, install)
};
