module.exports = function (name) {
  return `
    module.exports = function isAuthenticated(req, res, next) {
        if (!req.user || req.user.role !== "${name}") return res.status(400).send("NOT LOGGED IN");
        
        next();
      };
      `;
};
