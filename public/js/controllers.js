angular
  .module("politiciansPromiseApp")
  .controller("authenticationController", ["$scope", "authenticationService", function($scope, authenticationService) {
    $scope.user = authenticationService.getUser();
  }])
  .controller("politicianController", ["$scope", "$window", "backendData", "politicianService", "promiseService", "authenticationService", function($scope, $window, backendData, politicianService, promiseService, authenticationService) {
    $scope.mergeData = function(data) {
      for (var attr in data) { 
        $scope[attr] = data[attr]; 
      }        
    };
    $scope.mergeData(backendData);
    $scope.tabId = "LatestPromises";
    $scope.newPromise = {state: "", evidence_date: moment().toDate(), evidences: [""]};
    $scope.promisePage = 1;
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
      if(authenticationService.ensureAuth()) {
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
      if(authenticationService.ensureAuth()) {      
        promiseService.voteOnPromise(promise).then(function(response) {
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
      promiseService.getPromises($scope.politician, category).then(function(response) {
        $scope.mergeData(response.data.data);            
        $scope.category = category;
      });
    };
    $scope.nextPromisePage = function(tabId) {
      $scope.promisePage++;
      var resources = {
        "LatestPromises": promiseService.getLatestPromises,
        "MajorPromises": promiseService.getMajorPromises,
        "OlderPromises": promiseService.getOlderPromises
      }

      var promise = null;
      if(tabId === "AllPromises" && $scope.promisePage === 1) {
        promise = promiseService.getAllPromises($scope.politician)
      } else {
        promise = resources[tabId]($scope.politician, $scope.promisePage)
      }

      return promise;  
    };
    $scope.appendNextPromisePage = function() {
      var promise = $scope.nextPromisePage($scope.tabId);   
      NProgress.start();
      promise.then(function(response) {
        if(response.data.result === "SUCCESS") {
          $scope.promises = $scope.promises.concat(response.data.data.promises)
          NProgress.done();
        }
      }); 
    };
    $scope.isCurrentTab = function(tabId) {
      return $scope.tabId === tabId;
    };
    $scope.selectTab = function(tabId) {
      $scope.promisePage = 0;
      var promise = $scope.nextPromisePage(tabId);   
      NProgress.start();
      promise.then(function(response) {
        if(response.data.result === "SUCCESS") {
          $scope.tabId = tabId;    
          $scope.mergeData(response.data.data);
          NProgress.done();
        }
      }); 
    };
    $scope.isFirstIndex = function(index) {
      return index === 0;
    };
    $scope.registerPromise = function() {
      if(authenticationService.ensureAuth()) {
        $window.location.href = "/politico/" + $scope.politician.slug + "/nova-promessa";
      }
    }
  }])
  .controller("promiseController", ["$scope", "$window", "backendData", "politicianService", "promiseService", "promiseCategoryService", "oembedService", "authenticationService", function($scope, $window, backendData, politicianService, promiseService, promiseCategoryService, oembedService, authenticationService) {
    $scope.editing = false;
    $scope.editedPromise = {category: backendData.category, evidences: [{}]};
    $scope.registering = false;    

    $scope.mergeData = function(data) {
      for (var attr in data) { 
        $scope[attr] = data[attr]; 
      }        
    };
    $scope.mergeAttrs = function(data, target) {
      for (var attr in data) { 
        target[attr] = data[attr]; 
      }  
    };
    $scope.mergeData(backendData);
              
    $scope.votedOnPromise = function() {
      return authenticationService.isUserAuthenticated() && $scope.promiseUserVote && $scope.promiseUserVote.promise_id === $scope.promise.id;
    };
    $scope.voteOnPromise = function() {      
      if(authenticationService.ensureAuth()) {
        promiseService.voteOnPromise($scope.promise).then(function(response) {
          if(response.data.result === "SUCCESS") {
            var promiseUserVote = response.data.data.promiseUserVote;
            $scope.promiseUserVote = promiseUserVote;
            if(promiseUserVote) {
              $scope.totalPromiseUsersVotes++;
            } else {                
              $scope.totalPromiseUsersVotes--;
            }
          } else {

          }
        });
      }
    };
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
      if(authenticationService.ensureAuth()) { 
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
    $scope.isTextEvidence = function(evidence) {
      return evidence.type === "TEXT";
    };
    $scope.isVideoEvidence = function(evidence) {
      return evidence.type === "VIDEO";
    };
    $scope.edit = function() {
      if(authenticationService.ensureAuth()) {
        if($scope.promise.evidence_date) {
          $scope.promise.evidence_date = new Date($scope.promise.evidence_date);
        }
        $scope.editedPromise = angular.copy($scope.promise);
        if($scope.editedPromise.evidences.length === 0) {
          $scope.editedPromise.evidences.push({});
        }
        $scope.editing = true;
        if(!$scope.categories) {
          promiseCategoryService.getAllCategories().then(function(response) {
            if(response.data.result === "SUCCESS") {
              $scope.mergeData(response.data.data);
            }
          });
        }   
      }
    };
    $scope.isRegistering = function() {
      return $scope.registering === true;
    }
    $scope.registerPromise = function() {
      var promiseData = {};
      var editedPromise = $scope.editedPromise;

      promiseData.title = editedPromise.title;
      promiseData.description = editedPromise.description;
      promiseData.category_id = editedPromise.category.id;
      promiseData.politician_id = $scope.politician.id;
      promiseData.evidence_date = editedPromise.evidence_date;
      promiseData.state = editedPromise.state;
      promiseData.evidences = [];
      for(var index in editedPromise.evidences) {
        var evidence = editedPromise.evidences[index];
        if(evidence.url) {
          promiseData.evidences.push(evidence);
        }
      }
      promiseService.registerPromise(promiseData).then(function(response) {
        if(response.data.result === "SUCCESS") {
          var promise = response.data.data.promise;
          $window.location.href = "/politico/" + $scope.politician.slug + "/" + promise.id + "/" + promise.slug;
        }
      });
    }
    $scope.isEditing = function() {
      return $scope.editing === true;
    };
    $scope.cancelEdition = function() {          
      $scope.editing = false;
    };
    $scope.saveEdition = function() {
      var promiseData = {};
      var editedPromise = $scope.editedPromise;

      promiseData.id = editedPromise.id;
      promiseData.title = editedPromise.title;
      promiseData.description = editedPromise.description;
      promiseData.category_id = editedPromise.category_id;
      promiseData.evidence_date = editedPromise.evidence_date;
      promiseData.state = editedPromise.state;
      promiseData.evidences = [];
      for(var index in editedPromise.evidences) {
        var evidence = editedPromise.evidences[index];
        if(evidence.url) {
          promiseData.evidences.push(evidence);
        }
      }        
      promiseService.editPromise(promiseData).then(function(response) {
        if(response.data.result === "SUCCESS") {
          $scope.mergeAttrs(response.data.data.promise, $scope.promise);
          $scope.totalPromiseEvidences = response.data.data.totalPromiseEvidences;
          $scope.cancelEdition();
        }
      });
    };
    $scope.isPromiseStateChoosed = function(state) {
      return $scope.editedPromise.state === state;
    };
    $scope.choosePromiseState = function(state) {
      $scope.editedPromise.state = state;
    };
    $scope.isLastEvidence = function(index) {
      return $scope.editedPromise.evidences.length === index + 1;
    };
    $scope.isHiddenEvidence = function(index) {
      return index > 1 && !$scope.showHiddenEvidences;
    };
    $scope.showAllEvidences = function() {
      $scope.showHiddenEvidences = true;
    }
    $scope.addEvidence = function(index) {          
      $scope.editedPromise.evidences.push({});
    };
    $scope.removeEvidence = function(index) {          
      $scope.editedPromise.evidences.slice(index, 1);
    };
    $scope.selectCategory = function(category) {
      $scope.editedPromise.category = category;
      $scope.editedPromise.category_id = category.id;
    };
    $scope.getEvidenceInfos = function(evidence, event) {
      var url = event.originalEvent.clipboardData.getData('text/plain');
      NProgress.start();
      oembedService.getOEmbed(encodeURIComponent(url)).then(function(response) {
        NProgress.done();        
        if(response.data.result === "SUCCESS") {
          var data = response.data.data;
          var meta = data.meta;
          if(meta.title) {
            evidence.title = meta.title;
          }
          if(meta.canonical) {
            evidence.url = meta.canonical;
          }
          if(meta.description) {
            evidence.description = meta.description;
          }          
          if(data.host) {
            evidence.host = data.host;
          }
          for(index in data.links) {
            var link = data.links[index];
            if(link.rel) {
              for(relIndex in link.rel) {
                var rel = link.rel[relIndex];
                if(rel === "thumbnail") {
                  evidence.thumbnail = link.href;
                }
              }
            }
          }
        }
      });
    }
  }]);