// * NPM Packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");

const app = express();

// * Routes import
const auth = require("./routes/auth.js");
const user = require("./routes/user");
// const googleAuth = require("./routes/googleAuth");
const doctor = require("./routes/doctor");
const authdoctor = require("./routes/authdoctor");

// * Middleware
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, //24 HOURS
    secret: process.env.COOKIE_SECRET,

    keys: ["RANDOM KEY"],
  })
);
//! cookie session
// * Passport Setup
require("./passportStrats/passportLocalStrat");
// require("./passportStrats/passortGoogleStrat")(passport);
require("./config/doctor-passportLocal");
app.use(passport.initialize());
app.use(passport.session());

// * Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on ${PORT}`));

// * DB connection
mongoose
  .connect("mongodb://localhost:27017/foss-hackathon-temp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db locally"))
  .catch((err) => console.log("error in connecting to db ", err));

// * Routes setup
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/doctor", doctor);
app.use("/api/authdoctor", authdoctor);
// app.use("/api/googleAuth", googleAuth);

require("./config/passportInit")(passport);
