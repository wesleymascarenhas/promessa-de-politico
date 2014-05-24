var Politician          = require('../models/models').Politician,
    PoliticianUserVote  = require('../models/models').PoliticianUserVote,
    PoliticalParty      = require('../models/models').PoliticalParty,
    PoliticalOffice     = require('../models/models').PoliticalOffice,
    PoliticalOrgan      = require('../models/models').PoliticalOrgan,
    Bookshelf           = require('../models/models').Bookshelf,
    BluebirdPromise     = require('bluebird'),
    modelUtils          = require('../utils/modelUtils'),
    _                   = require('underscore');

exports.forge = function(data) {
  return Politician.forge(modelUtils.filterAttributes('Politician', data));
}

exports.findById = function(politician_id, relateds) {
  return this.forge({politician_id: politician_id}).fetch({withRelated: relateds});
}

exports.findBySlug = function(slug, relateds) {
  return this.forge({slug: slug}).fetch({withRelated: relateds});
}

exports.getUserVote = function(user, politician) {
  return PoliticianUserVote.forge({user_id: user.id, politician_id: politician.id}).fetch();
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

exports.countUsersVotes = function(politician) {
  return new BluebirdPromise(function(resolve, reject) {
    Bookshelf.knex('politician_user_vote')
    .select(Bookshelf.knex.raw('vote_type, count(*) as votes'))
    .where('politician_id', politician.id)
    .groupBy('vote_type')
    .then(function(counts) {      
      var countsMap = {};
      _.each(counts, function(count) {
        countsMap[count.vote_type] = count.votes;
      });
      resolve(countsMap);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.update = function(politician) {
  return politician.save();
}

exports.findAllPoliticalParties = function() {
  return PoliticalParty.collection().fetch();
}

exports.findAllPoliticalOffices = function() {
  return PoliticalOffice.collection().fetch();
}

exports.findAllPoliticalOrgans = function() {
  return PoliticalOrgan.collection().fetch();
}