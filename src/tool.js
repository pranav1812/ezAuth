// all file system manipulation functions
const util = require("./util/util.js");
const process = require('process');
const {spawn}= require('child_process');
const routes = ["blogs"];
const authRoutes = ["user", "doctor"];
const relPath = "../testServer";
const providers = ["local", "google"];
const config = {
  PORT: 3000,
  MONGODB_URI: "mongodb://localhost:27017/foss-hackathon-temp",
  COOKIE_SECRET: "COOKIE_SECRET",
  GOOGLE_CLIENT_ID: "google_clientID",
  GOOGLE_CLIENT_SECRET: "google_client_secret",
  SMTP_USER: "user",
  SMTP_PASS: "pass",
  SMTP_HOST: "host",
};
const register = true;
const signin = true;

function init(routes, authRoutes, providers, config, staticClient, relPath, installArr) {
  const {
    createFolder,
    createRoute,
    createModel,
    createAuth,
    createPassport_Serialize_Deserialize,
    createMiddleware,
    createEmailSetup,
    createDotenv,
    createGitignore,
    createServer,
    createStaticFrontend,
  } = util(relPath);

  function intiFolders() {
    createFolder("routes");
    createFolder("config");
    createFolder("models");
    createFolder("middleware");
  }

  function initRoutes(routes) {
    routes.forEach((route) => {
      createModel(route);
      createRoute(route, `../models/${route}`);
    });
  }
  function initAuthRoutes(authRoutes) {
    authRoutes.forEach((route) => {
      createModel(route, true);
      createRoute(route, `../models/${route}`, true);
      createAuth(route, `../models/${route}`, providers);
      createMiddleware(route, relPath);
    });
  }

  function create(routes, authRoutes, providers, staticClient, config, installArr) {
    intiFolders();
    createDotenv(config);
    createGitignore();
    createEmailSetup();
    initRoutes(routes);
    initAuthRoutes(authRoutes);
    if (authRoutes.length) createPassport_Serialize_Deserialize(authRoutes);
    createServer(routes, authRoutes, providers);
    if (staticClient) createStaticFrontend();
    console.log("installation might take a couple of minutes");
    // pass install command
    var installation= spawn('npm', ['i', ...installArr])
    // console.log(process.cwd())
    console.log("might take a couple of minutes...")
    installation.on('error', (err)=> console.log(err))
    installation.on('close', (code)=> {
        if(code!= 0){
            console.log("some error occured")
        }else{
            console.log("done")
        }
    })

  }
  create(routes, authRoutes, providers, staticClient, config, installArr);
}
// init(routes, authRoutes, providers, config, relPath);

//! multer
//! package.json // dependencies // child spwan for npm i

module.exports = init;
