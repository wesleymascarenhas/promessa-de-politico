angular
  .module("politiciansPromiseApp")   
  .controller("politicianController", ["$scope", "politicianService", "promiseService", function($scope, politicianService, promisesService) {
    $scope.mergeData = function(data) {
      for (var attr in data) { 
        $scope[attr] = data[attr]; 
      }        
    };
    $scope.mergeData(data);
    $scope.tabId = "LatestPromises";
    $scope.newPromise = {state: "", evidence_date: moment().toDate(), evidences: [""]};
    $scope.totalPoliticianUpUsersVotes = function() {
      return "UP" in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes["UP"] : 0;
    };   
    $scope.totalPoliticianDownUsersVotes = function() {
      return "DOWN" in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes["DOWN"] : 0;
    };  
    $scope.incrementTotalPoliticianUsersVotes = function(vote_type) {
      $scope.totalPoliticianUsersVotes[vote_type] = vote_type in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes[vote_type] + 1 : 1;
    };
    $scope.decrementTotalPoliticianUsersVotes = function(vote_type) {
      $scope.totalPoliticianUsersVotes[vote_type] = vote_type in $scope.totalPoliticianUsersVotes ? $scope.totalPoliticianUsersVotes[vote_type] + -1 : 0;
    };
    $scope.votedInPolitician = function(vote_type) {
      return $scope.politicianUserVote && $scope.politicianUserVote.vote_type === vote_type;
    };
    $scope.voteInPolitician = function(vote_type) { 
      if($scope.user) { 
        var oldPoliticianUserVote = $scope.politicianUserVote;
        politicianService.voteInPolitician($scope.politician, vote_type).then(function(response) {
          if(response.data.result === "SUCCESS") {
            $scope.politicianUserVote = response.data.data.politicianUserVote;
            if($scope.politicianUserVote) {
              if($scope.politicianUserVote.vote_type === "UP") {                    
                $scope.incrementTotalPoliticianUsersVotes("UP");
              } else {
                $scope.incrementTotalPoliticianUsersVotes("DOWN");
              }
              if(oldPoliticianUserVote) {
                $scope.decrementTotalPoliticianUsersVotes(oldPoliticianUserVote.vote_type);            
              }
            } else {
              $scope.decrementTotalPoliticianUsersVotes(oldPoliticianUserVote.vote_type);
            }
          }
        });
      }
    };
    $scope.totalPromisesOfCategory = function(category) {     
      var totalPromises = $scope.totalPromisesByCategory[category.id];
      if(!totalPromises) {
        totalPromises = 0;
      }
      return totalPromises;
    };
    $scope.totalPromiseUsersVotes = function(promise) {
      var totalVotes = $scope.totalUsersVotesByPromise[promise.id];
      if(!totalVotes) {
        totalVotes = 0;
      }
      return totalVotes;
    };
    $scope.incrementTotalPromiseUsersVotes = function(promise) {
      var totalVotes = $scope.totalPromiseUsersVotes(promise);
      totalVotes++;
      $scope.totalUsersVotesByPromise[promise.id] = totalVotes;
    };
    $scope.decrementTotalPromiseUsersVotes = function(promise) {
      var totalVotes = $scope.totalPromiseUsersVotes(promise);
      if(totalVotes > 0) {
        totalVotes--;
      }
      $scope.totalUsersVotesByPromise[promise.id] = totalVotes;
    };
    $scope.totalPromiseUsersComments = function(promise) {    
      var totalUsersComments = $scope.totalUsersCommentsByPromise[promise.id];
      if(!totalUsersComments) {
        totalUsersComments = 0;
      }
      return totalUsersComments;
    };
    $scope.totalPromiseEvidences = function(promise) {
      var totalEvidences = $scope.totalEvidencesByPromise[promise.id];
      if(!totalEvidences) {
        totalEvidences = 0;
      }
      return totalEvidences;
    };
    $scope.votedOnPromise = function(promise) {
      var voted = false;
      if($scope.userVotesByPromise) { 
        voted = promise.id in $scope.userVotesByPromise;          
      }
      return voted;
    };
    $scope.voteOnPromise = function(promise) {
      if($scope.user) {
        promisesService.voteOnPromise(promise).then(function(response) {
          if(response.data.result === "SUCCESS") {
            var promiseUserVote = response.data.data.promiseUserVote;
            if(promiseUserVote) {
              $scope.userVotesByPromise[promise.id] = promiseUserVote;
              $scope.incrementTotalPromiseUsersVotes(promise);
            } else {
              delete $scope.userVotesByPromise[promise.id];
              $scope.decrementTotalPromiseUsersVotes(promise);                  
            }
          } else {

          }
        });
      }
    };   
    $scope.isCurrentCategory = function(category) {
      return $scope.category.id === category.id;
    };
    $scope.selectCategory = function(category) {
      promisesService.getPromises($scope.politician, category).then(function(response) {
        $scope.mergeData(response.data.data);            
        $scope.category = category;
      });
    };
    $scope.isCurrentTab = function(tabId) {
      return $scope.tabId === tabId;
    };
    $scope.selectTab = function(tabId) {
      var resources = {
        "AllPromises": promisesService.getAllPromises,
        "LatestPromises": promisesService.getLatestPromises,
        "MajorPromises": promisesService.getMajorPromises,
        "OlderPromises": promisesService.getOlderPromises
      }
      NProgress.start();
      NProgress.set(50);
      resources[tabId]($scope.politician).then(function(response) {
        $scope.mergeData(response.data.data);
        $scope.tabId = tabId;
        NProgress.done();
      });          
    };
    $scope.isFirstIndex = function(index) {
      return index === 0;
    };       
  }]);