var BluebirdPromise        = require('bluebird'),
    politicianService      = require('./politicianService')
    promiseService         = require('./promiseService'),
    promiseCategoryService = require('./promiseCategoryService'),
    helper                 = require('../utils/helper');

exports.fillPolitician = function(user, vars) {
  return BluebirdPromise.all([politicianService.countUsersVotes(vars.politician), user ? politicianService.getUserVote(user, vars.politician) : null])
  .spread(function(totalPoliticianUsersVotes, politicianUserVote) {
    vars.totalPoliticianUsersVotes = totalPoliticianUsersVotes;    
    vars.politicianUserVote = politicianUserVote;                  
  });
}

exports.fillPromise = function(user, vars) { 
  return new BluebirdPromise(function(resolve, reject) {  
    BluebirdPromise.all([promiseService.countUsersVotes(vars.promise), promiseService.countUsersComments(vars.promise), promiseService.countEvidences(vars.promise), user ? promiseService.findUserVote(user, vars.promise) : null])
    .spread(function(totalPromiseUsersVotes, totalPromiseUsersComments, totalPromiseEvidences, promiseUserVote) {
      vars.totalPromiseUsersVotes = totalPromiseUsersVotes;
      vars.totalPromiseUsersComments = totalPromiseUsersComments;           
      vars.totalPromiseEvidences = totalPromiseEvidences;
      vars.promiseUserVote = promiseUserVote;    
      resolve(vars);              
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.fillPromises = function(user, vars) { 
  return new BluebirdPromise(function(resolve, reject) { 
    BluebirdPromise.all([promiseService.countUsersVotesByPromise(vars.promises), promiseService.countUsersCommentsByPromise(vars.promises), promiseService.countEvidencesByPromise(vars.promises), user ? promiseService.findUserVotesByPromise(user, vars.promises) : null])
    .spread(function(totalUsersVotesByPromise, totalUsersCommentsByPromise, totalEvidencesByPromise, userVotesByPromise) {
      vars.totalUsersVotesByPromise = totalUsersVotesByPromise;
      vars.totalUsersCommentsByPromise = totalUsersCommentsByPromise;           
      vars.totalEvidencesByPromise = totalEvidencesByPromise;
      vars.userVotesByPromise = userVotesByPromise;      
      resolve(vars);            
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.getPromises = function(user, politician, category) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    var vars = {};
    promiseService.findAllByPoliticianAndCategory(politician, category, ['registeredByUser'])
    .then(function(promises) {         
      vars.promises = promises;
      that.fillPromises(user, vars).then(function() {
        resolve(vars);
      }).catch(function(err) {
        reject(err);
      });
    });
  });
}

exports.getAllPromises = function(user, politician) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {  
    var vars = {};
    BluebirdPromise.all([promiseCategoryService.findByPolitician(politician), promiseService.countGroupingByCategory(politician)])
    .spread(function(categories, totalPromisesByCategory) {
      vars.categories = categories;
      vars.category = categories.at(helper.randomIndex(categories));    
      vars.totalPromisesByCategory = totalPromisesByCategory;                
      promiseService.findAllByPoliticianAndCategory(politician, vars.category, ['registeredByUser'])
      .then(function(promises) {         
        vars.promises = promises;
        that.fillPromises(user, vars).then(function() {
          resolve(vars);
        }).catch(function(err) {
          reject(err);
        });
      }).catch(function(err) {
        reject(err);
      });
    });
  });
}

exports.getMajorPromises = function(user, politician, page, pageSize) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    promiseService.majorPromises(politician, ['registeredByUser', 'category'], page, pageSize).then(function(promises) {
      var vars = {promises: promises};
      that.fillPromises(user, vars).then(function() {
        resolve(vars);
      }).catch(function(err) {
        reject(err);
      });
    });
  });
}

exports.getOlderPromises = function(user, politician, page, pageSize) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    promiseService.olderPromises(politician, ['registeredByUser', 'category'], page, pageSize).then(function(promises) {
      var vars = {promises: promises};
      that.fillPromises(user, vars).then(function() {
        resolve(vars);
      }).catch(function(err) {
        reject(err);
      });
    });
  });
}

exports.getLatestPromises = function(user, politician, page, pageSize) {
  var that = this;
  return new BluebirdPromise(function(resolve, reject) {
    promiseService.latestPromises(politician, ['registeredByUser', 'category'], page, pageSize).then(function(promises) {
      var vars = {promises: promises};
      that.fillPromises(user, vars).then(function() {
        resolve(vars);
      }).catch(function(err) {
        reject(err);
      });
    });
  });
}

exports.getAllCategories = function() {
  return new BluebirdPromise(function(resolve, reject) {
    var vars = {};
    promiseCategoryService.findAll().then(function(categories) {
      vars.categories = categories;
      resolve(vars);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.voteOnPromise = function(user, promise) {
  return new BluebirdPromise(function(resolve, reject) {
    promiseService.vote(user, promise).then(function(promiseUserVote) {
      resolve({promiseUserVote: promiseUserVote});
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.voteInPolitician = function(user, promise, vote_type) {
  return new BluebirdPromise(function(resolve, reject) {
    politicianService.vote(user, promise, vote_type).then(function(politicianUserVote) {
      resolve({politicianUserVote: politicianUserVote});
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.editPromise = function(user, promise, evidences) {
  return new BluebirdPromise(function(resolve, reject) {
    promiseService.update(user, promise, evidences).then(function(updated) {      
      promiseService.countEvidences(promise).then(function(totalPromiseEvidences) {
        resolve({promise: promise, totalPromiseEvidences: totalPromiseEvidences});        
      });
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.registerPromise = function(user, promise, evidences) {
  return new BluebirdPromise(function(resolve, reject) {
    promiseService.register(user, promise, evidences).then(function(registered) {
      resolve({promise: promise});
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.getPoliticalAssociations = function() {
  return new BluebirdPromise(function(resolve, reject) {
    BluebirdPromise.all([politicianService.findAllPoliticalParties(), politicianService.findAllPoliticalOffices(), politicianService.findAllPoliticalOrgans()]).spread(function(politicalParties, politicalOffices, politicalOrgans) {
      var vars = {politicalParties: politicalParties, politicalOffices: politicalOffices, politicalOrgans: politicalOrgans};      
      resolve(vars);
    }).catch(function(err) {
      reject(err);
    });
  });
}