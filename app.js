/**
 * Module dependencies.
 */
var express  = require('express'),
		passport = require('passport'),
		settings = require('./configs/settings'),
    engine   = require('./configs/engine'),
		routes   = require('./configs/routes'),
    auth     = require('./configs/authentication'),
		path     = require('path'),
		app      = express();

// all environments
app.set('env', settings.nodeEnv)
app.set('port', settings.nodePort);
app.set('views', path.join(__dirname, 'views'));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/uploads" }));
app.use(express.methodOverride());
app.use(express.cookieParser('promessas'));
app.use(express.session('promessas'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('dev' == app.get('env')) {
  app.use(express.errorHandler());
}

engine.configure(app);
routes.configure(app, passport);
auth.configure(app, passport);
var server = app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port'));
});