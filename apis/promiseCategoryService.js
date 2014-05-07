var PromiseCategory = require('../models/models').PromiseCategory;

exports.forge = function(data) {
  return PromiseCategory.forge(data);
}

exports.findByPolitician = function(politician) {
  return PromiseCategory.collection().query(function(qb) {
    qb.whereIn('id', function() {
      this.distinct('category_id').select().from('promise').where('politician_id', politician.id);
    }).orderBy('name', 'asc');
  }).fetch();
}

exports.findAll = function() {
  return PromiseCategory.collection().fetch();
}