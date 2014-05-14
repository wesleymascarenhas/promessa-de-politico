var Bookshelf           = require('../models/models').Bookshelf,
    Promise             = require('../models/models').Promise,
    PromiseUserVote     = require('../models/models').PromiseUserVote,
    bookshelfUtils      = require('../utils/bookshelfUtils'),
    BluebirdPromise     = require('bluebird'),
    _                   = require('underscore');

exports.forge = function(data) {
  return Promise.forge(data);
}

exports.forgeCollection = function(data) {
  return Promise.collection.forge(data);
}

exports.findById = function(promise_id, relateds) {
  return this.forge({id: promise_id}).fetch({withRelated: relateds});
}

exports.findAllByPolitician = function(politician, relateds) {
  return Promise.collection().query({where: {politician_id: politician.id}}).fetch({withRelated: relateds});
}

exports.findAllByPoliticianAndCategory = function(politician, category, relateds) {
  return Promise.collection().query({where: {politician_id: politician.id, category_id: category.id}}).fetch({withRelated: relateds});
}

exports.olderPromises = function(politician, relateds) {
  return Promise.collection().query(function(qb) {
    qb.orderBy('evidence_date', 'asc').orderBy('registration_date', 'asc');
  }).fetch({withRelated: relateds});
}

exports.latestPromises = function(politician, relateds) {
  return Promise.collection().query(function(qb) {
    qb.orderBy('evidence_date', 'desc').orderBy('registration_date', 'desc');
  }).fetch({withRelated: relateds});
}

exports.majorPromises = function(politician, relateds) {
  // select p.id, count(*) as total_votes from promise p join promise_priority_vote ppv on p.id = ppv.promise_id group by promise_id order by total_votes desc;
}

exports.findUserVote = function(user, promise) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    that.findUserVotesByPromise(user, [promise]).then(function(userVotesByPromise) {
      if(promise.id in userVotesByPromise) {
        resolve(userVotesByPromise[promise.id]);
      } else {
        resolve(null);
      }
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.findUserVotesByPromise = function(user, promises) {  
  return new BluebirdPromise(function(resolve, reject) {
    PromiseUserVote.collection().query(function(qb) {
      qb.where('user_id', user.id).whereIn('promise_id', bookshelfUtils.getIds(promises));
    }).fetch().then(function(userVotesByPromise) {
      var userVotesByPromiseMap = {};
      userVotesByPromise.forEach(function(promiseUserVote) {        
        userVotesByPromiseMap[promiseUserVote.get('promise_id')] = promiseUserVote;
      });
      resolve(userVotesByPromiseMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countUsersVotes = function(promise) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    that.countUsersVotesByPromise([promise]).then(function(usersVotesCounts) {
      if(promise.id in usersVotesCounts) {
        resolve(usersVotesCounts[promise.id]);
      } else {
        resolve(0);
      }
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countUsersVotesByPromise = function(promises) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('promise_user_vote')
    .select(Bookshelf.knex.raw('promise_id, count(*) as votes'))
    .whereIn('promise_id', bookshelfUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(usersVotesCounts) {      
      var usersVotesCountsMap = {};
      _.each(usersVotesCounts, function(usersVotesCount) {
        usersVotesCountsMap[usersVotesCount.promise_id] = usersVotesCount.votes;
      });
      resolve(usersVotesCountsMap);
    }).catch(function(err) {
      reject(err);
    });
  }); 
}

exports.countUsersComments = function(promise) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    that.countUsersCommentsByPromise([promise]).then(function(usersCommentsCounts) {
      if(promise.id in usersCommentsCounts) {
        resolve(usersCommentsCounts[promise.id]);
      } else {
        resolve(0);
      }
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countUsersCommentsByPromise = function(promises) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('promise_user_comment')
    .select(Bookshelf.knex.raw('promise_id, count(*) as comments'))
    .whereIn('promise_id', bookshelfUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(usersCommentsCounts) {      
      var usersCommentsCountsMap = {};
      _.each(usersCommentsCounts, function(usersCommentsCount) {
        usersCommentsCountsMap[usersCommentsCount.promise_id] = usersCommentsCount.comments;
      });
      resolve(usersCommentsCountsMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countEvidences = function(promise) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    that.countEvidencesByPromise([promise]).then(function(evidencesCounts) {
      if(promise.id in evidencesCounts) {
        resolve(evidencesCounts[promise.id]);
      } else {
        resolve(0);
      }
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countEvidencesByPromise = function(promises) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('promise_evidence')
    .select(Bookshelf.knex.raw('promise_id, count(*) as evidences'))
    .whereIn('promise_id', bookshelfUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(evidencesCounts) {      
      var evidencesCountsMap = {};
      _.each(evidencesCounts, function(evidencesCount) {
        evidencesCountsMap[evidencesCount.promise_id] = evidencesCount.evidences;
      });
      resolve(evidencesCountsMap);
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
        mapByCategory[promiseCountByCategory.category_id] = promiseCountByCategory.promises;
      });      
      resolve(mapByCategory);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.vote = function(user, promise) {
  return new BluebirdPromise(function(resolve, reject) {
    var promiseUserVote = PromiseUserVote.forge({user_id: user.id, promise_id: promise.id});    
    promiseUserVote.save().then(function(promiseUserVote) {
      resolve(promiseUserVote);
    }).catch(function(err) {
      if(err.clientError.cause.code === "ER_DUP_ENTRY") {   
        Bookshelf.knex('promise_user_vote')        
        .where('user_id', user.id)
        .andWhere('promise_id', promise.id)
        .del().then(function(rowsDeleted) {
          resolve(null);
        }).catch(function(err) {
          reject(err);
        });          
      } else {        
        reject(err);
      }
    });
  });
}