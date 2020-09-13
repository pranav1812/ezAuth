const router = require("express").Router();
const passport = require("passport");

const isAuthenticated = require("../middleware/authDoctor");

router.post("/doctor/login", passport.authenticate("doctor"), (req, res) => {
  console.log("logged in doctor");
  return res.send(req.user);
});

router.get("/doctor/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out");
});

module.exports = router;
