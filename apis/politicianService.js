var Politician = require('../models/models').Politician;

exports.findBySlug = function(slug, relateds) {
  return Politician.forge({slug: slug}).fetch({withRelated: relateds});
}