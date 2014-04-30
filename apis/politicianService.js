var Politician = require('../models/models').Politician;

exports.findBySlug = function(slug, relateds, callback) {
  Politician.forge({slug: slug}).fetch({withRelated: relateds}).then(function(politician) {    
    callback(politician);
  });
}