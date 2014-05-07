var Politician = require('../models/models').Politician;

exports.forge = function(data) {
  return Politician.forge(data);
}

exports.findById = function(politician_id, relateds) {
  return Politician.forge({politician_id: politician_id}).fetch({withRelated: relateds});
}

exports.findBySlug = function(slug, relateds) {
  return Politician.forge({slug: slug}).fetch({withRelated: relateds});
}