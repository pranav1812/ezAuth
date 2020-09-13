const router = require("express").Router();
const passport = require("passport");

const isAuthenticated = require("../middleware/authUser");

// * Login
router.post(`/user/login`, passport.authenticate("user"), (req, res) => {
  return res.send(req.user);
});

// * Logout
router.get("/user/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out");
});

module.exports = router;
