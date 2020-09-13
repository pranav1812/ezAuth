const router = require("express").Router();
const passport = require("passport");

const isAuthenticated = require("../middleware/auth");

// * Login
router.get(
  `/user/login`,
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    return res.send(req.user);
  }
);

router.get("/login/callback", passport.authenticate("google"), (req, res) => {
  res.send(req.user);
});

// * Logout
router.get("/user/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out");
});

module.exports = router;
