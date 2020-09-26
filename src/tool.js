// all file system manipulation functions

const fs = require("fs");

const path = require("path");

function createFolder(name, relPath) {
  const pathname = `${path.resolve(__dirname, relPath, name)}`;

  return fs.mkdirSync(pathname, { recursive: true });
}
function createDotenv(config, relPath) {
  let content = "";
  Object.keys(config).forEach((key) => (content += `${key}=${config[key]}\n`));

  fs.writeFile(path.resolve(__dirname, relPath, ".env"), content, function (
    err
  ) {
    if (err) console.log(err);
  });
}
function createGitignore(relPath) {
  fs.writeFile(
    path.resolve(__dirname, relPath, ".gitignore"),
    `node_modules/\n`,
    function (err) {
      if (err) console.log(err);
    }
  );
}
function createEmailSetup(relPath) {
  fs.writeFile(
    path.resolve(__dirname, relPath, "config", "emailSetup.js"),
    require(`../templates/emailSetup`)(),
    function (err) {
      if (err) console.log(err);
    }
  );
}
// async function copyFile(src, dest) {
//   return fs.copyFile(src, dest, fs.constants.COPYFILE_EXCL, (err) => {
//     if (err) throw err; //! create folder automatically
//     //! if file already exists ... see what to do
//   });
// }

function createRoute(name, modelPath, relPath = "./", auth = false) {
  fs.writeFile(
    path.resolve(__dirname, relPath, "routes", `${name}.js`),
    require(`../templates/${auth ? "authRoute" : "route"}`)(name, modelPath),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function createAuth(name, modelPath, modes, relPath = "./") {
  modes.forEach((provider) => {
    fs.writeFile(
      path.resolve(__dirname, relPath, "routes", `${name}-${provider}-Auth.js`),
      require(`../templates/${provider}AuthRoute`)(name),
      function (err) {
        if (err) console.log(err);
      }
    );
    fs.writeFile(
      path.resolve(
        __dirname,
        relPath,
        "config",
        `${name}-${provider}-passportStrategy.js`
      ),
      require(`../templates/${provider}-passportStrategy`)(name, modelPath),
      function (err) {
        if (err) console.log(err);
      }
    );
  });
}

function createPassport_Serialize_Deserialize(authRoutes, relPath) {
  fs.writeFile(
    path.resolve(
      __dirname,
      relPath,
      "config",
      "passport_Serialize_Deserialize.js"
    ),

    require("../templates/serializeUser")(authRoutes),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function createMiddleware(name, relPath) {
  fs.writeFile(
    path.resolve(__dirname, relPath, "middleware", `${name}Auth.js`),
    require("../templates/authMiddleware")(name),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function createServer(routes, authRoutes, providers, relPath) {
  fs.writeFile(
    path.resolve(__dirname, relPath, "index.js"),

    require("../templates/index")(routes, authRoutes, providers),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function createModel(route, relPath, auth = false) {
  fs.writeFile(
    path.resolve(__dirname, relPath, "models", `${route}.js`),
    require(`../templates/${auth ? "authModel" : "model"}`)(route),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function intiFolders(relPath = "") {
  createFolder("routes", relPath);
  createFolder("config", relPath);
  createFolder("models", relPath);
  createFolder("middleware", relPath);
}
function init(routes, authRoutes, providers, config, relPath) {
  intiFolders(relPath);
  createDotenv(config, relPath);
  createGitignore(relPath);
  createEmailSetup(relPath);
  routes.forEach((route) => {
    createModel(route, relPath);
    createRoute(route, `../models/${route}`, relPath);
  });
  authRoutes.forEach((route) => {
    createModel(route, relPath, true);
    createRoute(route, `../models/${route}`, relPath, true);
    createAuth(route, `../models/${route}`, providers, relPath);
    createMiddleware(route, relPath);
  });
  createPassport_Serialize_Deserialize(authRoutes, relPath);
  createServer(routes, authRoutes, providers, relPath);
  console.log("done");
}

const routes = ["blogs"];
const authRoutes = ["user", "doctor"];
const relPath = "testServer";
const providers = ["local", "google"];
const config = {
  PORT: 3000,
  MONGODB_URI: "mongodb://localhost:27017/foss-hackathon-temp",
  COOKIE_SECRET: "COOKIE_SECRET",
  CLIENT_ID:
    "1058385372966-en1e83onb58cl5nds1n52t6gtop48mp3.apps.googleusercontent.com",
  CLIENT_SECRET: "qDvvTzX6NANTZd5z1xC1bIN8",
};
init(routes, authRoutes, providers, config, relPath);

//! nodemialer
//! multer
//! package.json // dependencies // child spwan for npm i

module.exports = init;
