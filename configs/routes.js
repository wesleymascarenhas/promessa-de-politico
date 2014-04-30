exports.configure = function(app, passport) {
	console.log('Configuring routes');
	
	require('../routes/authentication')(app, passport);
	require('../routes/user')(app, passport);
  require('../routes/politician')(app, passport);
  require('../routes/promise')(app, passport);
	require('../routes/index')(app);
	require('../routes/error')(app);
}