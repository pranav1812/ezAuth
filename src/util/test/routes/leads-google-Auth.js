
    
    
const router = require("express").Router();
const passport = require("passport");

const isAuthenticated = require("../middleware/leadsAuth");
    

router.get(
  '/login',
  passport.authenticate("leads-google", { scope: ["profile", "email"] }),
  (req, res) => {
    return res.send(req.user);
  }
);

router.get("/login/callback", passport.authenticate("leads-google"), (req, res) => {
  res.send(req.user);
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out");
});

module.exports = router;

    