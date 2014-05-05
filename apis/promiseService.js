var Bookshelf           = require('../models/models').Bookshelf,
    Promise             = require('../models/models').Promise,
    PromisePriorityVote = require('../models/models').PromisePriorityVote,
    bookshelfUtils      = require('../utils/bookshelfUtils'),
    BluebirdPromise     = require('bluebird'),
    _                   = require('underscore');

exports.findById = function(promiseId, relateds) {
  return Promise.forge({id: promiseId}).fetch({withRelated: relateds});
}

exports.findAllByPolitician = function(politician, relateds) {
  return Promise.collection().query({where: {politician_id: politician.id}}).fetch({withRelated: relateds});
}

exports.findAllByPoliticianAndCategory = function(politician, category, relateds) {
  return Promise.collection().query({where: {politician_id: politician.id, category_id: category.id}}).fetch({withRelated: relateds});
}

exports.findPriorityVotes = function(user, promises) {
  return PromisePriorityVote.collection().query(function(qb) {
    qb.where('user_id', user.id).whereIn('promise_id', bookshelfUtils.getIds(promises));
  }).fetch();
}

exports.count = function(politician) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('promise')
    .select(Bookshelf.knex.raw('count(*) as promises'))
    .where('politician_id', politician.id)
    .then(function(count) {      
      if(count && count.length > 0) {
        resolve(count[0].promises);
      } else {
        resolve(0);
      }
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countGroupingByState = function(politician) {
  return new BluebirdPromise(function(resolve, reject) {    
    Bookshelf.knex('promise')
    .select(Bookshelf.knex.raw('state, count(*) as promises'))
    .where('politician_id', politician.id)
    .groupBy('state')
    .then(function(promisesCountsByState) {     
      var mapByState = {};
      _.each(promisesCountsByState, function(promiseCountByState) {
        mapByState[promiseCountByState.state] = promiseCountByState.promises;
      });
      if(!mapByState['NONE']) {
        mapByState['NONE'] = 0;
      }
      if(!mapByState['STARTED']) {
        mapByState['STARTED'] = 0;
      }
      if(!mapByState['FULFILLED']) {
        mapByState['FULFILLED'] = 0;
      }
      if(!mapByState['DISCARDED']) {
        mapByState['DISCARDED'] = 0;
      }
      resolve(mapByState);
    }).catch(function(err) {
      reject(err);
    });
  });
}