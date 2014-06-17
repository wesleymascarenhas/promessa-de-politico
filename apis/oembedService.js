var BluebirdPromise = require('bluebird'),
    url             = require('url'),
    request         = require('request');

exports.getOEmbed = function(uri) {
  return new BluebirdPromise(function(resolve, reject) {
    request.get({url: 'http://iframely.com/iframely?uri=' + uri, json: true}, function(err, res, obj) {
      if(err) {
        reject(err);
      } else {
        obj.host = url.parse(uri).host;
        resolve(obj);
      }
    });
  });
}