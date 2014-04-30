var nunjucks = require('nunjucks');

exports.configure = function(app) {
  
  app.engine('html', nunjucks.render);
  var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
  });

}



