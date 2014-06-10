var Politician          = require('../models/models').Politician,
    PoliticianUserVote  = require('../models/models').PoliticianUserVote,
    PoliticalParty      = require('../models/models').PoliticalParty,
    PoliticalOffice     = require('../models/models').PoliticalOffice,
    PoliticalOrgan      = require('../models/models').PoliticalOrgan,
    State               = require('../models/models').State,
    Bookshelf           = require('../models/models').Bookshelf,
    modelUtils          = require('../utils/modelUtils'),
    helper              = require('../utils/helper'),
    BluebirdPromise     = require('bluebird'),
    $                   = this;

exports.forge = function(data) {
  return Politician.forge(modelUtils.filterAttributes('Politician', data));
}

exports.forgeState = function(data) {
  return State.forge(data);
}

exports.forgePoliticalParty = function(data) {
  return PoliticalParty.forge(data);
}

exports.findById = function(politician_id, related) {
  return this.forge({id: politician_id}).fetch({withRelated: related});
}

exports.findByIds = function(politicians_ids, related) {
  return Politician.collection().query({whereIn: ['id', politicians_ids]}).fetch({withRelated: related});
}

exports.findBySlug = function(slug, related) {
  return this.forge({slug: slug}).fetch({withRelated: related});
}

exports.findAll = function() {
  return Politician.collection().fetch();
}

exports.getUserVote = function(user, politician) {
  return PoliticianUserVote.forge({user_id: user.id, politician_id: politician.id}).fetch();
}

exports.getUserVotes = function(user, politicians) {
  return new BluebirdPromise(function(resolve, reject) {
    if(politicians.length > 0) {
      PoliticianUserVote.collection().query({where: ['user_id', user.id], whereIn: ['politician_id', modelUtils.getIds(politicians)]}).fetch()
      .then(function(userVotes) {
        var userVotesByPolitician = {};
        userVotes.forEach(function(userVote) {
          userVotesByPolitician[userVote.get('politician_id')] = userVote;
        });
        resolve(userVotesByPolitician);
      }).catch(function(err) {
        reject(err);
      });
    } else {
      resolve({});
    }
  });
}

exports.vote = function(user, politician, vote_type) {
  return new BluebirdPromise(function(resolve, reject) {
    var politicianUserVote = PoliticianUserVote.forge({user_id: user.id, politician_id: politician.id});
    politicianUserVote.fetch().then(function(userVote) {
      if(userVote) {
        if(vote_type === userVote.get('vote_type')) {
          Bookshelf.knex('politician_user_vote')        
          .where('user_id', user.id)
          .andWhere('politician_id', politician.id)
          .del().then(function(rowsDeleted) {
            resolve(null);
          }).catch(function(err) {
            reject(err);
          });          
        } else {
          Bookshelf.knex('politician_user_vote')        
          .where('user_id', user.id)
          .andWhere('politician_id', politician.id)
          .update({'vote_type': vote_type}).then(function(rowsUpdated) {
            politicianUserVote.set('vote_type', vote_type);
            resolve(politicianUserVote);
          }).catch(function(err) {
            reject(err);
          });
        }
      } else {
        politicianUserVote.set('vote_type', vote_type);
        resolve(politicianUserVote.save());
      }
    });
  });
}

var countUsersVotesFromOne = function(politician) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('politician_user_vote')
    .select('vote_type', Bookshelf.knex.raw('count(*) as votes'))
    .where('politician_id', politician.id)
    .groupBy('vote_type')
    .then(function(usersVotesCounts) {  
      var usersVotesCountsMap = {};
      usersVotesCounts.forEach(function(userVoteCount) {
        usersVotesCountsMap[userVoteCount.vote_type] = userVoteCount.votes;
      });
      resolve(usersVotesCountsMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

var countUsersVotesFromMany = function(politician) {
  return new BluebirdPromise(function(resolve, reject) {
    if(politician.length > 0) {
      Bookshelf.knex('politician_user_vote')
      .select('politician_id', 'vote_type', Bookshelf.knex.raw('count(*) as votes'))
      .whereIn('politician_id', modelUtils.getIds(politician))
      .groupBy('politician_id', 'vote_type')
      .then(function(usersVotesCounts) {  
        var usersVotesCountsMap = {};
        usersVotesCounts.forEach(function(userVoteCount) {
          if(!(userVoteCount.politician_id in usersVotesCountsMap)) {
            usersVotesCountsMap[userVoteCount.politician_id] = {};
          }
          if(!(userVoteCount.vote_type)) {
            usersVotesCountsMap[userVoteCount.politician_id][userVoteCount.vote_type] = 0;
          } 
          usersVotesCountsMap[userVoteCount.politician_id][userVoteCount.vote_type] = userVoteCount.votes;
        });
        resolve(usersVotesCountsMap);
      }).catch(function(err) {
        reject(err);
      });
    } else {
      resolve({});
    }
  });
}

exports.countUsersVotes = function(politician) {  
  if(Array.isArray(politician)) {
    return countUsersVotesFromMany(politician);
  } else {
    return countUsersVotesFromOne(politician);
  }
}

exports.update = function(politician) {
  if(politician.get('political_office_id') === 1) {
    politician.set('state_id', null);
  }
  return politician.save();
}

exports.register = function(user, politician) {
  return new BluebirdPromise(function(resolve, reject) {
    if(politician.id) {
      reject();
    } else {
      politician.set('registered_by_user_id', user.id);
      politician.set('slug', helper.slugify(politician.get('name')));
      resolve(politician.save());
    }
  });
}

exports.allPoliticalParties = function() {
  return PoliticalParty.collection().query({orderBy: ['acronym', 'asc']}).fetch();
}

exports.allPoliticalOffices = function() {
  return PoliticalOffice.collection().fetch();
}

exports.allPoliticalOrgans = function() {
  return PoliticalOrgan.collection().fetch();
}

exports.allStates = function() {
  return State.collection().query({orderBy: ['name', 'asc']}).fetch();
}

var rankPoliticians = function(type, page, pageSize, politicalParty, state) {
  return new BluebirdPromise(function(resolve, reject) {
    var condition = type === 'best' ? '>=' : '<';
    var order = type === 'best' ? 'desc' : 'asc';
    var query = Bookshelf.knex('promise')
    .select(Bookshelf.knex.raw('politician.*'), 'politician_id', Bookshelf.knex.raw('count(*) as total_promises'), Bookshelf.knex.raw('(select count(*) from promise where politician_id = politician.id and state = "FULFILLED") as total_fulfilled_promises, round(((select count(*) from promise where politician_id = politician.id and state = "FULFILLED") * 100) / count(*)) as percentage_promises_fulfilled'))
    .join('politician', 'politician.id', '=', 'promise.politician_id');
    if(politicalParty) {
      query.where({political_party_id: politicalParty.id});
    }
    if(state) {
      query.where({state_id: state.id});
    }
    query.having('percentage_promises_fulfilled', condition, 50)
    .groupBy('politician_id')
    .orderBy('percentage_promises_fulfilled', order)
    .then(function(politiciansRows) {
      var politicians = [];
      politiciansRows.forEach(function(politicianRow) {        
        var politician = $.forge(politicianRow);
        politician.set({total_promises: politicianRow.total_promises, total_fulfilled_promises: politicianRow.total_fulfilled_promises, percentage_promises_fulfilled: politicianRow.percentage_promises_fulfilled});
        politicians.push(politician);
      });
      resolve(politicians);
    }).catch(function(err) {
      reject(err);
    });
  });
}


exports.bestPoliticians = function(page, pageSize, politicalParty, state) {
  return rankPoliticians('best', page, pageSize, politicalParty, state);
}

exports.worstPoliticians = function(page, pageSize, politicalParty, state) {
  return rankPoliticians('worst', page, pageSize, politicalParty, state);
}

exports.search = function(value, columns) {
  return Politician.collection().query({where: ['name', 'like', '%' + value + '%'], orWhere: ['nickname', 'like', '%' + value + '%']}).fetch({columns: columns});
}