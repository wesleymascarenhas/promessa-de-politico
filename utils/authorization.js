var userService = require('../apis/userService');

exports.isAuthenticated = function (req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/home');
  }
}

exports.isNotAuthenticated = function (req, res, next) {
  if(!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/home');
  }
}

exports.userExists = function(req, res, next) {
  userService.findById(req.body.id).then(function(user) {
    if(user) {
      next();
    } else {
      res.redirect('/signup')    
    }
  }).catch(function(err) {
    next(err);
  });
}