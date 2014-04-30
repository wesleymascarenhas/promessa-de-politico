var Promise         = require('../models/models').Promise,
    PromiseCategory = require('../models/models').PromiseCategory,
    _               = require('underscore');

exports.findById = function(promiseId, relateds, callback) {
  Promise.forge({id: promiseId}).fetch({withRelated: relateds}).then(function(promise) {
    callback(promise);
  });
}

exports.findAllByPolitician = function(politician, relateds, callback) {
  Promise.collection().query({where: {politician_id: politician.get('id')}}).fetch({withRelated: relateds}).then(function(promises) {
    callback(promises);
  });
}

exports.findAllCategories = function(callback) {
  PromiseCategory.collection().fetch().then(function(categories) {
    callback(categories);
  });
}

exports.groupPromisesByCategoryId = function(promises) {  
  return promises.groupBy(function(promise) {
    return promise.get('category_id');
  });

}