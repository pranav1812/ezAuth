module.exports = function (name) {
  return `
    
    
const router = require("express").Router();
const passport = require("passport");

const isAuthenticated = require("../middleware/auth");//!create


router.get(
  '/${name}/login',
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    return res.send(req.user);
  }
);

router.get("/${name}/login/callback", passport.authenticate("google"), (req, res) => {
  res.send(req.user);
});

router.get("/${name}/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out");
});

module.exports = router;

    `;
};
