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
  return new BluebirdPromise(function(revolse, reject) {
    return PromisePriorityVote.collection().query(function(qb) {
      qb.where('user_id', user.id).whereIn('promise_id', bookshelfUtils.getIds(promises));
    }).fetch().then(function(priorityVotes) {
      var priorityVotesMap = {};
      priorityVotes.forEach(function(priorityVote) {
        priorityVotesMap[priorityVote.promise_id] = priorityVote
      });
      resolve(priorityVotesMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countPriorityVotes = function(promises) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('promise_priority_vote')
    .select(Bookshelf.knex.raw('promise_id, count(*) as votes'))
    .whereIn('promise_id', bookshelfUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(counts) {      
      var countsMap = {};
      _.each(counts, function(count) {
        countsMap[count.promise_id] = count.votes;
      });
      resolve(countsMap);
    }).catch(function(err) {
      reject(err);
    });
  }); 
}

exports.countComments = function(promises) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('promise_comment')
    .select(Bookshelf.knex.raw('promise_id, count(*) as comments'))
    .whereIn('promise_id', bookshelfUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(counts) {      
      var countsMap = {};
      _.each(counts, function(count) {
        countsMap[count.promise_id] = count.comments;
      });
      resolve(countsMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countEvidences = function(promises) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('promise_evidence')
    .select(Bookshelf.knex.raw('promise_id, count(*) as evidences'))
    .whereIn('promise_id', bookshelfUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(counts) {      
      var countsMap = {};
      _.each(counts, function(count) {
        countsMap[count.promise_id] = count.evidences;
      });
      resolve(countsMap);
    }).catch(function(err) {
      reject(err);
    });
  });
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

exports.countGroupingByCategory = function(politician) {
  return new BluebirdPromise(function(resolve, reject) {    
    Bookshelf.knex('promise')
    .select(Bookshelf.knex.raw('category_id, count(*) as promises'))
    .where('politician_id', politician.id)
    .groupBy('category_id')
    .then(function(promisesCountsByCategory) {     
      var mapByCategory = {};
      _.each(promisesCountsByCategory, function(promiseCountByCategory) {
        mapByCategory[promiseCountByCategory.state] = promiseCountByCategory.promises;
      });      
      resolve(mapByCategory);
    }).catch(function(err) {
      reject(err);
    });
  });
}