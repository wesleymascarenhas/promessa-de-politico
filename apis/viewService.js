var promiseService = require('./promiseService');

exports.loadPromises = function(politician, category, user, results) {
  return promiseService.findAllByPoliticianAndCategory(politician, category, ['registered_by_user'])
  .then(function(promises) {
    results.promises = promises;            
    return [promiseService.countPriorityVotes(promises), promiseService.countEvidences(promises), promiseService.countComments(promises)];
  }).spread(function(totalPriorityVotesByPromise, totalEvidencesByPromise, totalCommentsByPromise) {
    results.totalPriorityVotesByPromise = totalPriorityVotesByPromise;
    results.totalEvidencesByPromise = totalEvidencesByPromise;
    results.totalCommentsByPromise = totalCommentsByPromise;           
    if(user) {        
      return promiseService.findPriorityVotes(user, promises)
      .then(function(priorityVotesByPromise) {
        results.priorityVotesByPromise = priorityVotesByPromise;                  
      });
    }              
  });
}