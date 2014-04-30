var userService = require('../apis/userService');

exports.isAuthenticated = function (req, res, next){
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

exports.isNotAuthenticated = function (req, res, next){
  if(!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/home");
  }
}

exports.userExists = function(req, res, next) {
  userService.findById(req.body.id, function (err, user) {
    if (!err && user != null) {
      next();
    } else {            
      res.redirect("/signup")
    }
  });
}