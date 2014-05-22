var Bookshelf           = require('../models/models').Bookshelf,
    Promise             = require('../models/models').Promise,
    PromiseUserVote     = require('../models/models').PromiseUserVote,
    PromiseEvidence     = require('../models/models').PromiseEvidence,
    PromiseEvidences     = require('../models/models').PromiseEvidences,
    bookshelfUtils      = require('../utils/bookshelfUtils'),
    BluebirdPromise     = require('bluebird'),
    _                   = require('underscore');

exports.forge = function(data) {
  return Promise.forge(data);
}

exports.forgeCollection = function(data) {
  return Promise.collection().forge(data);
}

exports.forgeEvidence = function(data) {
  return PromiseEvidence.forge(data);
}

exports.forgeEvidenceCollection = function(data) {
  return PromiseEvidences.forge(data);
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

exports.olderPromises = function(politician, relateds, page, pageSize) {
  return Promise.collection().query(function(qb) {
    qb.orderBy(Bookshelf.knex.raw('isnull(evidence_date)'), 'asc').orderBy('registration_date', 'asc').limit(pageSize).offset((page - 1) * pageSize);
  }).fetch({withRelated: relateds});
}

exports.latestPromises = function(politician, relateds, page, pageSize) {
  return Promise.collection().query(function(qb) {
    qb.orderBy('evidence_date', 'desc').orderBy('registration_date', 'desc').limit(pageSize).offset((page - 1) * pageSize);
  }).fetch({withRelated: relateds});
}

exports.majorPromises = function(politician, relateds, page, pageSize) {
  return Promise.collection().query(function(qb) {  
    var subQuery = Bookshelf.knex('promise_user_vote').select('promise_id', Bookshelf.knex.raw('count(*) as votes')).groupBy('promise_id').toString();
    qb
    .join(
      Bookshelf.knex.raw('(' + subQuery + ') as promise_user_vote'),
      'promise.id', '=',
      'promise_user_vote.promise_id',
      'left'
    )
    .orderBy('promise_user_vote.votes', 'desc')
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  }).fetch({withRelated: relateds});
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
      if(!mapByState['NON_STARTED']) {
        mapByState['NON_STARTED'] = 0;
      }
      if(!mapByState['STARTED']) {
        mapByState['STARTED'] = 0;
      }
      if(!mapByState['FULFILLED']) {
        mapByState['FULFILLED'] = 0;
      }
      if(!mapByState['PARTIALLY_FULFILLED']) {
        mapByState['PARTIALLY_FULFILLED'] = 0;
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

exports.update = function(user, promise, evidences) {
  return new BluebirdPromise(function(resolve, reject) {
    promise.save().then(function(promise) {
      evidences.forEach(function(evidence) {
        if(evidence.isNew()) {          
          evidence.set('promise_id', promise.id);
          evidence.set('registered_by_user_id', user.id);
        }
      });
      evidences.invokeThen('save').then(function(evidences) {
        promise.load(['category', 'evidences']).then(function(promise) {
          resolve(promise);
        });
      });
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.register = function(user, promise, evidences) {
  return new BluebirdPromise(function(resolve, reject) {
    promise.set('registered_by_user_id', user.id);
    promise.set('slug', helper.slugify(promise.get('title')));
    promise.save().then(function(promise) {
      evidences.forEach(function(evidence) {
        evidence.set('promise_id', promise.id);
        evidence.set('registered_by_user_id', promise.get('registered_by_user_id'));
      });
      evidences.invokeThen('save').then(function(evidences) {
        promise.load(['category', 'evidences']).then(function(promise) {
          resolve(promise);
        });
      });
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.removeEvidence = function(user, evidence) {
  return evidence.destroy();
}