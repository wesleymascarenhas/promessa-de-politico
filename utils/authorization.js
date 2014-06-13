var userService = require('../apis/userService');

exports.isAuthenticated = function (req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/politicos');
  }
}

exports.isNotAuthenticated = function (req, res, next) {
  if(!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/politicos');
  }
}