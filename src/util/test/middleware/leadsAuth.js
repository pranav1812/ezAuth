
    module.exports = function isAuthenticated(req, res, next) {
        if (!req.user || req.user.role !== "leads") return res.status(400).send("NOT LOGGED IN");
        
        next();
      };
      