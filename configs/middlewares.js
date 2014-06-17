exports.configure = function(app, passport) {
  console.log('Configuring middlewares');

  app.use(function(req, res, next) {
    res.locals.backendData = {
      user: req.user
    };
    next();
  });
}