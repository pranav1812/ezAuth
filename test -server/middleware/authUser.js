module.exports = function isAuthenticated(req, res, next) {
  if (!req.user.role === "user") return res.status(400).send("NOT LOGGED IN");
  req.user = req.user.user;
  next();
};

//! generlize
