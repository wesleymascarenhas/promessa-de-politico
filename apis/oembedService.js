var BluebirdPromise = require('bluebird'),
    url             = require('url'),
    request         = require('request'),
    settings        = require('../configs/settings'),
    apiErrors       = require('./errors/apiErrors'),
    _               = require('underscore');

var oembedApiKey = settings.oembedApiKey;
var prefixURL = 'https://iframe.ly/api/iframely?api_key=' + oembedApiKey + '&url=';
exports.getOEmbed = function(uri) {
  return new BluebirdPromise(function(resolve, reject) {
    request.get({url: prefixURL + uri, json: true}, function(err, res, obj) {
      if(err) {
        reject(err);
      } else if(!_.isObject(obj) || obj.error) {
        reject(new apiErrors.ValidationError('oembed', 'invalid'))
      } else {
        obj.host = url.parse(uri).host;
        resolve(obj);
      }
    });
  });
}