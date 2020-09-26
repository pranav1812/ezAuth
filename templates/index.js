module.exports = function (routes, authRoutes, providers) {
  return `
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");

const app = express();
//* Route imports
${routeImports(routes, authRoutes, providers)}

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, //24 HOURS
    secret: process.env.COOKIE_SECRET
  })
);

// * Passport Setup
${passportImports(authRoutes, providers)}
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport_Serialize_Deserialize");

// * Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(\`Server started on \${PORT}\`));

// * DB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db "))
  .catch((err) => console.log("error in connecting to db ", err));

// * Routes setup
${routeSetup(routes)}
${authRouteSetup(authRoutes, providers)}
`;

  function passportImports(authRoutes, providers) {
    let imports = "";
    authRoutes.forEach((route) => {
      providers.forEach((provider) => {
        // imports += `const ${route}Auth = require("./routes/${route}-${provider}-Auth");\n`;
        imports += `require("./config/${route}-${provider}-passportStrategy");\n`;
      });
    });
    return imports;
  }

  function routeSetup(routes) {
    let imports = "";
    routes.forEach((route) => {
      imports += `app.use("/api/${route}", ${route});\n`;
    });
    return imports;
  }
  function authRouteSetup(routes, providers) {
    let imports = "";
    routes.forEach((route) => {
      imports += `app.use("/api/${route}/", ${route});\n`;
      providers.forEach((provider) => {
        imports += `app.use("/api/auth/${provider}/${route}/", ${route}Auth_${provider} );\n`;
      });
    });
    return imports;
  }
  function routeImports(routes, authRoutes, providers) {
    let imports = "";
    routes.forEach(
      (route) => (imports += `const ${route} = require("./routes/${route}");\n`)
    );
    authRoutes.forEach(
      (route) => (imports += `const ${route} = require("./routes/${route}");\n`)
    );
    authRoutes.forEach((route) => {
      providers.forEach((provider) => {
        imports += `const ${route}Auth_${provider} = require("./routes/${route}-${provider}-Auth");\n`;
      });
      // imports += `const ${route}Auth = require("./routes/${route}-${provider}-Auth");\n`;
    });
    return imports;
  }
};
