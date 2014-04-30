var authorization = require('../utils/authorization')

module.exports = function(app, passport) {
	
	app.get('/login', authorization.isNotAuthenticated, function(req, res) {
		res.render('login.html');
	});
	
	app.get('/logout', authorization.isAuthenticated, function(req, res) {
	  req.logout();
	  res.redirect('/login');
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/home', failureRedirect: '/login' }));

}