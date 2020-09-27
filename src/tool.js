// all file system manipulation functions
const util = require("./util/util.js");

function init(routes, authRoutes, providers, config, relPath) {
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

  function create(routes, authRoutes, providers, config) {
    intiFolders();
    createDotenv(config);
    createGitignore();
    createEmailSetup();
    initRoutes(routes);
    initAuthRoutes(authRoutes);
    if (authRoutes.length) createPassport_Serialize_Deserialize(authRoutes);
    createServer(routes, authRoutes, providers);
    console.log("done");
  }
  create(routes, authRoutes, providers, config);
}
init(routes, authRoutes, providers, config, relPath);

//! multer
//! package.json // dependencies // child spwan for npm i

module.exports = init;
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
};
