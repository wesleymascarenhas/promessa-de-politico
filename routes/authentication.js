var authorization = require('../utils/authorization')

module.exports = function(app, passport) {

  app.get('/logout', authorization.isAuthenticated, function(req, res) {
    req.logout();
    res.redirect('/politicos');
  });

  app.get('/auth-success', function(req, res) {
    res.render('/auth/auth-success.html');
  });

  app.get('/auth-fail', function(req, res) {
    res.render('/auth/auth-fail.html');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth-success', failureRedirect: '/auth-fail' }));

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/auth-success', failureRedirect: '/auth-fail' }));

  app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));
  app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/auth-success', failureRedirect: '/auth-fail' }));

}