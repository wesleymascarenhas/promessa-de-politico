module.exports = function(app) {

  app.use(function(req, res) {
    res.status(404);
    res.render('error.html', {
      statusCode: 404,
      statusMessage: 'Página não encontrada'
    });
  });

  app.use(function(err, req, res, next) {
		res.status(500);
    res.render('error.html', {
      statusMessage: 'Erro interno',
      errorMessage: err
    });
	});

}