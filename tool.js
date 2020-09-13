const fs = require("fs");
// const path = require("path");
// const util = require("util");

// const t = require("./template");
// //! if folder already exists?

// async function createFolder(name, path) {
//   const pathname = `${path}/${name}`;
//   return fs.mkdir(pathname, { recursive: true }, (err) => {
//     if (err) throw err;
//   });
// }

// async function copyFile(src, dest) {
//   return fs.copyFile(src, dest, fs.constants.COPYFILE_EXCL, (err) => {
//     if (err) throw err; //! create folder automatically
//     //! if file already exists ... see what to do
//   });
// }

// async function abc() {
//   await createFolder("abcTEMP", "./");
//   await copyFile("./server.js", "./abcTEMP/test");
//   console.log("a");
//   if (fs.existsSync(`./abcTEMP`)) console.log("aaaaaaa");
//   if (fs.existsSync(`./abcTEMP/test`)) console.log("bbbbb");
// }

// // abc();
// console.log("test");
// console.log(t("user", "../models/user"));

function createRoute(name, modelPath) {
  fs.writeFile(
    `routes/${name}.js`,
    require("./templates/route")(name, modelPath),
    function (err) {
      if (err) console.log(err);
    }
  );
}

function createAuth(name, modelPath) {
  fs.writeFile(
    `routes/auth${name}.js`,
    require("./templates/localAuthRoute")(name),
    function (err) {
      if (err) console.log(err);
    }
  );

  fs.writeFile(
    `config/${name}-passportLocal.js`,
    require("./templates/passportLocalStrategy")(name, modelPath),
    function (err) {
      if (err) console.log(err);
    }
  );
}
function createPassportInit(modelsList) {
  fs.writeFile(
    `config/passportInit.js`,
    require("./templates/serializeUser")(modelsList),
    function (err) {
      if (err) console.log(err);
    }
  );
}
function createMiddleware(name) {
  fs.writeFile(
    `middleware/${name}Auth.js`,
    require("./templates/authMiddleware")(name),
    function (err) {
      if (err) console.log(err);
    }
  );
}

const modelsList = ["../models/user", "../models/doctor"];

createRoute("doctor", "../models/doctor");
createAuth("doctor", "../models/doctor");
createMiddleware("doctor");
createRoute("user", "../models/user");
createAuth("user", "../models/user");
createMiddleware("user");
createPassportInit(modelsList);
