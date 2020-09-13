module.exports = function isAuthenticated(req, res, next) {
  if (!req.user.role === "doctor") return res.status(400).send("NOT LOGGED IN");
  req.user = req.user.doctor;
  next();
};

//! generlize
