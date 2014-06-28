var Bookshelf           = require('../models/models').Bookshelf,
    Promise             = require('../models/models').Promise,
    PromiseUserVote     = require('../models/models').PromiseUserVote,
    PromiseEvidence     = require('../models/models').PromiseEvidence,
    PromiseEvidences    = require('../models/models').PromiseEvidences,
    PromiseUserComment  = require('../models/models').PromiseUserComment,
    PromiseCategory     = require('../models/models').PromiseCategory;
    PoliticianUpdate    = require('../models/models').PoliticianUpdate,
    helper              = require('../utils/helper'),
    modelUtils          = require('../utils/modelUtils'),
    apiErrors           = require('./errors/apiErrors'),
    BluebirdPromise     = require('bluebird'),
    $                   = this;

exports.forge = function(data) {
  return Promise.forge(modelUtils.filterAttributes('Promise', data));
}

exports.forgeCollection = function(data) {
  return Promise.collection().forge(modelUtils.filterAttributes('Promise', data));
}

exports.forgeEvidence = function(data) {
  return PromiseEvidence.forge(modelUtils.filterAttributes('PromiseEvidence', data));
}

exports.forgeEvidenceCollection = function(data) {
  return PromiseEvidences.forge(modelUtils.filterAttributes('PromiseEvidence', data));
}

exports.forgeCategory = function(data) {
  return PromiseCategory.forge(data);
}

exports.findById = function(promise_id, related) {
  return this.forge({id: promise_id}).fetch({withRelated: related});
}

exports.findAllByPolitician = function(politician, related) {
  return Promise.collection().query({where: {politician_id: politician.id}}).fetch({withRelated: related});
}

exports.findAllByPoliticianAndCategory = function(politician, category, related) {
  return Promise.collection().query({where: {politician_id: politician.id, category_id: category.id}}).fetch({withRelated: related});
}

exports.findCategoriesByPolitician = function(politician) {
  return PromiseCategory.collection().query(function(qb) {
    qb.whereIn('id', function() {
      this.distinct('category_id').select().from('promise').where('politician_id', politician.id);
    }).orderBy('name', 'asc');
  }).fetch();
}

exports.findAllCategories = function() {
  return PromiseCategory.collection().fetch();
}

exports.olderPromises = function(politician, related, page, pageSize) {
  return Promise.collection().query(function(qb) {
    qb.where('politician_id', politician.id).orderBy(Bookshelf.knex.raw('isnull(evidence_date)'), 'asc').orderBy('registration_date', 'asc').limit(pageSize).offset((page - 1) * pageSize);
  }).fetch({withRelated: related});
}

exports.latestPromises = function(politician, related, page, pageSize) {
  return Promise.collection().query(function(qb) {
    qb.where('politician_id', politician.id).orderBy('evidence_date', 'desc').orderBy('registration_date', 'desc').limit(pageSize).offset((page - 1) * pageSize);
  }).fetch({withRelated: related});
}

exports.majorPromises = function(politician, related, page, pageSize) {
  return Promise.collection().query(function(qb) {
    var subQuery = Bookshelf.knex('promise_user_vote').select('promise_id', Bookshelf.knex.raw('count(*) as votes')).groupBy('promise_id').toString();
    qb
    .where('politician_id', politician.id)
    .join(
      Bookshelf.knex.raw('(' + subQuery + ') as promise_user_vote'),
      'promise.id', '=',
      'promise_user_vote.promise_id',
      'left'
    )
    .orderBy('promise_user_vote.votes', 'desc')
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  }).fetch({withRelated: related});
}

exports.loadUsersComments = function(promise) {
  return promise.load(['comments', 'comments.user']);
}

exports.comment = function(user, promise, comment) {
  return PromiseUserComment.forge({user_id: user.id, promise_id: promise.id, content: comment}).save();
}

exports.removeComment = function(comment_id) {
  return PromiseUserComment.forge({id: comment_id}).destroy();
}

exports.findUserComment = function(comment_id, related) {
  return PromiseUserComment.forge({id: comment_id}).fetch({withRelated: related});
}

exports.findUserVote = function(user, promise) {
  return new BluebirdPromise(function(resolve, reject) {
    $.findUserVotesByPromise(user, [promise]).then(function(userVotesByPromise) {
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
    PromiseUserVote.collection().query({where: {user_id: user.id}, whereIn: ['promise_id', modelUtils.getIds(promises)]}).fetch()
    .then(function(userVotesByPromise) {
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
  return new BluebirdPromise(function(resolve, reject) {
    $.countUsersVotesByPromise([promise]).then(function(usersVotesCounts) {
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
    .whereIn('promise_id', modelUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(usersVotesCounts) {
      var usersVotesCountsMap = {};
      usersVotesCounts.forEach(function(usersVotesCount) {
        usersVotesCountsMap[usersVotesCount.promise_id] = usersVotesCount.votes;
      });
      resolve(usersVotesCountsMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countUsersComments = function(promise) {
  return new BluebirdPromise(function(resolve, reject) {
    $.countUsersCommentsByPromise([promise]).then(function(usersCommentsCounts) {
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
    .whereIn('promise_id', modelUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(usersCommentsCounts) {
      var usersCommentsCountsMap = {};
      usersCommentsCounts.forEach(function(usersCommentsCount) {
        usersCommentsCountsMap[usersCommentsCount.promise_id] = usersCommentsCount.comments;
      });
      resolve(usersCommentsCountsMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.countEvidences = function(promise) {
  return new BluebirdPromise(function(resolve, reject) {
    $.countEvidencesByPromise([promise]).then(function(evidencesCounts) {
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
    .whereIn('promise_id', modelUtils.getIds(promises))
    .groupBy('promise_id')
    .then(function(evidencesCounts) {
      var evidencesCountsMap = {};
      evidencesCounts.forEach(function(evidencesCount) {
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
      promisesCountsByState.forEach(function(promiseCountByState) {
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
      if(!mapByState['NOT_FULFILLED']) {
        mapByState['NOT_FULFILLED'] = 0;
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
      promisesCountsByCategory.forEach(function(promiseCountByCategory) {
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

var registerPoliticianUpdates = function(user, oldPromise, newPromise) {
  var politicianUpdates = PoliticianUpdate.collection();
  var promiseFilteredData = newPromise.pick(modelUtils.modelsAttributes.PromiseFieldsToCompare);
  _.each(_.keys(promiseFilteredData), function(key) {
    if(oldPromise.get(key) !== promiseFilteredData[key]) {
      politicianUpdates.add({
        politician_id: newPromise.get('politician_id'),
        promise_id: newPromise.id,
        user_id: user.id,
        field: key,
        old_value: oldPromise.get(key),
        new_value: promiseFilteredData[key],
        update_type: 'PROMISE_UPDATED'
      });
    }
  });
  return politicianUpdates.invokeThen('save');
}

exports.update = function(user, promise, evidences) {
  return new BluebirdPromise(function(resolve, reject) {
    $.findById(promise.id).then(function(oldPromise) {
      if(oldPromise.get('state') !== promise.get('state')) {
        promise.set('last_state_update', new Date());
      }
      if(promise.get('state') !== 'FULFILLED') {
        promise.set('fulfilled_date', null);
      } else if(!promise.get('fulfilled_date')) {
        throw new apiErrors.ValidationError('promise', 'fulfilledDateRequired');
      }
      if(promise.get('fulfilled_date') && promise.get('evidence_date') && promise.get('fulfilled_date') < promise.get('evidence_date')) {
        throw new apiErrors.ValidationError('promise', 'fulfilledDateAfterEvidenceDate');
      }
      return [promise.save(), oldPromise];
    }).spread(function(promise, oldPromise) {
      return registerPoliticianUpdates(user, oldPromise, promise);
    }).then(function(politicianUpdates) {
      evidences.forEach(function(evidence) {
        if(evidence.isNew()) {
          evidence.set('promise_id', promise.id);
          evidence.set('registered_by_user_id', user.id);
        }
      });
      return evidences.invokeThen('save');
    }).then(function(evidences) {
      return promise.load(['category', 'evidences', 'evidences.registeredByUser']);
    }).then(function(promise) {
      resolve(promise);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.register = function(user, politician, promise, evidences) {
  return new BluebirdPromise(function(resolve, reject) {
    promise.set('politician_id', politician.id);
    promise.set('registered_by_user_id', user.id);
    promise.set('slug', helper.slugify(promise.get('title')));
    if(promise.get('state') === 'FULFILLED' && !promise.get('fulfilled_date')) {
      reject(new apiErrors.BadStateError('promise', 'fulfilledDateRequired'));
    } else {
      promise.save().then(function(promise) {
        evidences.forEach(function(evidence) {
          evidence.set('promise_id', promise.id);
          evidence.set('registered_by_user_id', promise.get('registered_by_user_id'));
        });
        return evidences.invokeThen('save');
      }).then(function(evidences) {
        return PoliticianUpdate.forge({politician_id: politician.id, promise_id: promise.id, user_id: user.id, update_type: 'PROMISE_CREATED'}).save();
      }).then(function(politicianUpdate) {
        return promise.load(['category', 'evidences', 'evidences.registeredByUser']);
      }).then(function(promise) {
        resolve(promise);
      }).catch(function(err) {
        reject(err);
      });
    }
  });
}

exports.removeEvidence = function(user, evidence) {
  return evidence.destroy();
}