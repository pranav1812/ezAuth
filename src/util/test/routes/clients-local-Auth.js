
      
    const router = require("express").Router();
    const passport = require("passport");
    
    const isAuthenticated = require("../middleware/clientsAuth");
    
    router.post('/login', passport.authenticate("clients"), (req, res) => {
      return res.send(req.user);
    });
    
    router.get("/logout", isAuthenticated, (req, res) => {
      req.logout();
      res.send("logged out");
    });
    
    module.exports = router;
    
      