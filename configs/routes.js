exports.configure = function(app, passport) {
	console.log('Configuring routes');

  app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  });

  app.use(app.router);
  require('../routes/authentication')(app, passport);
  require('../routes/politician')(app, passport);
  require('../routes/promise')(app, passport);
  require('../routes/index')(app);
  require('../routes/error')(app);
}