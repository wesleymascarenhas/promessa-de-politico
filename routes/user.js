var userService = require('../apis/userService'),
		authorization = require('../utils/authorization');

module.exports = function(app, passport) {

	app.get('/home', authorization.isAuthenticated, function(req, res) {	
		res.render('home.html', { user: req.user });					
	});

	app.get('/:username', function(req, res, next) {
		userService.findByUsername(req.params.username, function(user) {		
			if(user) {				
				res.render('home.html', { user: user });
			} else {
				next();
			}
		});
	});
	
}