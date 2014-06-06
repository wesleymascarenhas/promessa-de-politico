/**
 * Module dependencies.
 */
var express   = require('express'),
    passport  = require('passport'),  
    auth      = require('./configs/authentication'),
		settings  = require('./configs/settings'),
    engine    = require('./configs/engine'),
		routes    = require('./configs/routes'),
		path      = require('path'),
		app       = express();

// all environments
app.set('env', settings.nodeEnv)
app.set('port', settings.nodePort);
app.set('views', path.join(__dirname, 'views'));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('promessa-de-politico'));
app.use(express.session('promessa-de-politico'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('dev' == app.get('env')) {
  app.use(express.errorHandler());
}

engine.configure(app);
auth.configure(app, passport);
routes.configure(app, passport);
var server = app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port'));
});