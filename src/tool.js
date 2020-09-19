// all file system manipulation functions 

const fs = require("fs");

// const path = require("path");

async function createFolder(name) {
  const pathname = `${name}`;
  return fs.mkdir(pathname, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

// async function copyFile(src, dest) {
//   return fs.copyFile(src, dest, fs.constants.COPYFILE_EXCL, (err) => {
//     if (err) throw err; //! create folder automatically
//     //! if file already exists ... see what to do
//   });
// }

function createRoute(name, modelPath) {
  fs.writeFile(
    `routes/${name}.js`,
    require("../templates/route")(name, modelPath),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function createAuth(name, modelPath) {
  fs.writeFile(
    `routes/auth${name}.js`,
    require("../templates/localAuthRoute")(name),
    function (err) {
      if (err) console.log(err);
    }
  );

  fs.writeFile(
    `config/${name}-passportLocal.js`,
    require("../templates/passportLocalStrategy")(name, modelPath),
    function (err) {
      if (err) console.log(err);
    }
  );
}
function createPassport_Serialize_Deserialize(authRoutes) {
  fs.writeFile(
    `config/passport_Serialize_Deserialize.js`,
    require("../templates/serializeUser")(authRoutes),
    function (err) {
      if (err) console.log(err);
    }
  );
}
function createMiddleware(name) {
  fs.writeFile(
    `middleware/${name}Auth.js`,
    require("../templates/authMiddleware")(name),
    function (err) {
      if (err) console.log(err);
    }
  );
}
function createServer(routes, authRoutes) {
  fs.writeFile(
    `index.js`,
    require("../templates/index")(routes, authRoutes),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function createModel(route) {
  fs.writeFile(
    `models/${route}.js`,
    require("../templates/model")(route),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function intiFolders() {
  createFolder("./routes");
  createFolder("./config");
  createFolder("./models");
  createFolder("./middleware");
}

function init(routes, authRoutes) {
  intiFolders();
  routes.forEach((r) => {
    createModel(r);
    createRoute(r, `../models/${r}`);
  });
  authRoutes.forEach((r) => {
    createAuth(r, `../models/${r}`);
    createMiddleware(r);
  });
  createPassport_Serialize_Deserialize(authRoutes);

  //create package.json
  //dotenv
  createServer(routes, authRoutes);

  console.log("done");
}
const routes = ["user", "doctor", "blogs"];
const authRoutes = ["user", "doctor"];
module.exports= init;
