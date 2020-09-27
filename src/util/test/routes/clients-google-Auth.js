
    
    
const router = require("express").Router();
const passport = require("passport");

const isAuthenticated = require("../middleware/clientsAuth");
    

router.get(
  '/login',
  passport.authenticate("clients-google", { scope: ["profile", "email"] }),
  (req, res) => {
    return res.send(req.user);
  }
);

router.get("/login/callback", passport.authenticate("clients-google"), (req, res) => {
  res.send(req.user);
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out");
});

module.exports = router;

    