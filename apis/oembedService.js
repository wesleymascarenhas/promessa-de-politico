var BluebirdPromise = require('bluebird'),
    url             = require('url'),
    restify         = require('restify'),
    client          = restify.createJsonClient({
      url: 'http://iframely.com'
    });

exports.getOEmbed = function(uri) {
  return new BluebirdPromise(function(resolve, reject) {
    client.get('/iframely?uri=' + uri, function(err, req, res, obj) {      
      if(err) {
        reject(err);
      } else {
        obj.host = url.parse(uri).host;
        resolve(obj);
      }
    });
  });  
}