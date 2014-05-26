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
    $scope.editingPolitician = false;
    

    $scope.image ='';
    //NOTE: the $scope.$on evt is optional since using ngModel will automatically update this $scope value accordingly
    var evtImageUpload ='TestCtrlImageUpload';
    $scope.uploadOpts =
    {
      //'type':'byUrl',
      'uploadPath':'/imageUpload',
      'uploadDirectory':'/uploads',
      'serverParamNames': {
        'file': 'myFile'
      },
      'uploadCropPath':'/imageCrop',
      // 'callbackInfo':{'evtName':evtImageUpload, 'args':[{'var1':'yes'}]},
      'imageServerKeys':{'imgFileName':'result.fileNameSave', 'picHeight':'picHeight', 'picWidth':'picWidth', 'imgFileNameCrop':'result.newFileName'},    //hardcoded must match: server return data keys
      //'htmlDisplay':"<div class='ig-form-pic-upload'><div class='ig-form-pic-upload-button'>Select Photo</div></div>",
      'cropOptions': {'crop':true}
    };
    //OPTIONAL
    $scope.$on(evtImageUpload, function(evt, args) {
      //do extra post upload handling here..
      //$scope.formVals.image =args[1].imgFileName;
    });
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
        NProgress.start();
        politicianService.voteInPolitician($scope.politician, vote_type).then(function(response) {        
          NProgress.done();
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
        NProgress.start();      
        promiseService.voteOnPromise(promise).then(function(response) {        
          NProgress.done();
          var promiseUserVote = response.data.data.promiseUserVote;
          if(promiseUserVote) {
            $scope.userVotesByPromise[promise.id] = promiseUserVote;
            $scope.incrementTotalPromiseUsersVotes(promise);
          } else {
            delete $scope.userVotesByPromise[promise.id];
            $scope.decrementTotalPromiseUsersVotes(promise);                  
          }          
        });
      }
    };   
    $scope.isCurrentCategory = function(category) {
      return $scope.category.id === category.id;
    };
    $scope.selectCategory = function(category) {
      NProgress.start();
      promiseService.getPromises($scope.politician, category).then(function(response) {
        NProgress.done();
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
        NProgress.done();        
        $scope.promises = $scope.promises.concat(response.data.data.promises)
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
        NProgress.done();
        $scope.tabId = tabId;    
        $scope.mergeData(response.data.data);
      }); 
    };
    $scope.isFirstIndex = function(index) {
      return index === 0;
    };
    $scope.registerPromise = function() {
      if(authenticationService.ensureAuth()) {
        $window.location.href = "/politico/" + $scope.politician.slug + "/nova-promessa";
      }
    };
    $scope.isEditingPolitician = function() {
      return $scope.editingPolitician === true;
    }
    $scope.editPolitician = function() {
      if(authenticationService.ensureAuth()) {
        if(!$scope.politicalParties || !$scope.politicalOffices || !$scope.politicalOrgans) {
          politicianService.getPoliticalAssociations().then(function(response) {
            $scope.mergeData(response.data.data);
          });
        }
        $scope.editedPolitician = angular.copy($scope.politician);
        $scope.editingPolitician = true;
      }
    };
    $scope.cancelPoliticianEdition = function() {
      $scope.editingPolitician = false;
    };
    $scope.savePoliticianEdition = function() {
      politicianService.updatePolitician($scope.editedPolitician).then(function(response) {
        $scope.politician = angular.copy($scope.editedPolitician);
        $scope.cancelPoliticianEdition();
      });
    };
    $scope.politicalPartySelected = function() {
      $scope.editedPolitician.political_party_id = $scope.editedPolitician.party.id;
    };
    $scope.politicalOfficeSelected = function() {
      $scope.editedPolitician.political_office_id = $scope.editedPolitician.office.id;
    };
    $scope.politicalOrganSelected = function() {
      $scope.editedPolitician.political_organ_id = $scope.editedPolitician.organ.id;
    };
  }])
  .controller("promiseController", ["$scope", "$window", "backendData", "politicianService", "promiseService", "promiseCategoryService", "oembedService", "authenticationService", "modalService", function($scope, $window, backendData, politicianService, promiseService, promiseCategoryService, oembedService, authenticationService, modalService) {
    $scope.editingPromise = false;
    $scope.editedPromise = {category: backendData.category, evidences: [{}]};
    $scope.registeringPromise = false;  
    
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

    $scope.comment = function(content) {
      if(authenticationService.ensureAuth()) {        
        promiseService.comment($scope.promise, content).then(function(response) {
          var comment = response.data.data;
          comment.registration_date = new Date();
          $scope.promise.comments.unshift(comment);
          $scope.totalPromiseUsersComments++;
        });
      }
    };
    $scope.removeComment = function(comment, index) {
      if(authenticationService.ensureAuth()) {
        var modalScope = {
          headerText: "Remover comentário",
          bodyText: "Deseja realmente remover este comentário?"
        };   
        modalService.show({size: "sm"}, modalScope).then(function(result) {
          NProgress.start();
          promiseService.removeComment(comment).then(function(response) {
            NProgress.done();
            $scope.promise.comments.splice(index, 1);
            $scope.totalPromiseUsersComments--
          });                   
        }); 
      }
    };
    $scope.isCommentOwner = function(comment) {
      return authenticationService.getUser() && comment.user_id === authenticationService.getUser().id;
    }
    $scope.votedOnPromise = function() {
      return authenticationService.isUserAuthenticated() && $scope.promiseUserVote && $scope.promiseUserVote.promise_id === $scope.promise.id;
    };
    $scope.voteOnPromise = function() {      
      if(authenticationService.ensureAuth()) {
        NProgress.start();
        promiseService.voteOnPromise($scope.promise).then(function(response) {        
          NProgress.done();
          var promiseUserVote = response.data.data.promiseUserVote;
          $scope.promiseUserVote = promiseUserVote;
          if(promiseUserVote) {
            $scope.totalPromiseUsersVotes++;
          } else {                
            $scope.totalPromiseUsersVotes--;
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
        NProgress.start();
        politicianService.voteInPolitician($scope.politician, vote_type).then(function(response) {        
          NProgress.done();
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
    $scope.editPromise = function() {
      if(authenticationService.ensureAuth()) {
        $scope.editedPromise = angular.copy($scope.promise);
        if($scope.editedPromise.evidence_date) {
          $scope.editedPromise.evidence_date = new Date($scope.editedPromise.evidence_date);
        }
        if($scope.editedPromise.evidences.length === 0) {
          $scope.editedPromise.evidences.push({});
        }
        if(!$scope.categories) {
          NProgress.start();
          promiseCategoryService.getAllCategories().then(function(response) {
            NProgress.done();
            $scope.mergeData(response.data.data);            
          });
        }   
        $scope.editingPromise = true;
      }
    };
    $scope.isRegisteringPromise = function() {
      return $scope.registeringPromise === true;
    };
    $scope.registerPromise = function() {
      var evidencesData = [];
      var editedPromise = $scope.editedPromise;
      for(var index in editedPromise.evidences) {
        var evidence = editedPromise.evidences[index];
        if(evidence.url) {
          evidencesData.push(evidence);
        }
      }
      NProgress.start();
      promiseService.registerPromise(editedPromise, evidencesData).then(function(response) {      
        NProgress.done();
        var promise = response.data.data.promise;
        $window.location.href = "/politico/" + $scope.politician.slug + "/" + promise.id + "/" + promise.slug;
      });
    };
    $scope.isEditingPromise = function() {
      return $scope.editingPromise === true;
    };
    $scope.cancelPromiseEdition = function() {          
      $scope.editingPromise = false;
    };
    $scope.savePromiseEdition = function() {
      var evidencesData = [];
      var editedPromise = $scope.editedPromise;
            
      for(var index in editedPromise.evidences) {
        var evidence = editedPromise.evidences[index];
        if(evidence.url) {
          evidencesData.push(evidence);
        } else {
          editedPromise.evidences.splice(index, 1);
        }
      }  

      NProgress.start();
      promiseService.editPromise(editedPromise, evidencesData).then(function(response) {
        NProgress.done();
        $scope.promise = angular.copy(editedPromise);
        $scope.mergeAttrs(response.data.data.promise, $scope.promise);
        $scope.totalPromiseEvidences = response.data.data.totalPromiseEvidences;
        $scope.cancelPromiseEdition();       
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
    $scope.addEvidence = function() {          
      $scope.editedPromise.evidences.push({});
    };
    $scope.removeEvidence = function(evidence, index) {
      if(authenticationService.ensureAuth()) { 
        var modalScope = {
          headerText: "Deseja remover essa evidência ?",
          bodyText: "As evidências são importantes, pois comprovam essa promessa."
        };   
        modalService.show({size: "sm"}, modalScope).then(function(result) {
          NProgress.start();
          promiseService.removeEvidence(evidence).then(function(response) {
            NProgress.done();
            $scope.editedPromise.evidences.splice(index, 1);
          });
        });    
      }
    };
    $scope.categorySelected = function() {    
      $scope.editedPromise.category_id = $scope.editedPromise.category.id;
    };
    $scope.getEvidenceInfos = function(evidence, event) {
      var url = event.originalEvent.clipboardData.getData('text/plain');
      NProgress.start();
      oembedService.getOEmbed(encodeURIComponent(url)).then(function(response) {
        NProgress.done();        
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
        
        var foundThumbnail = false;
        var thumbnailLink = null;
        var iconLink = null;
        for(index in data.links) {
          var link = data.links[index];
          if(link.rel) {
            for(relIndex in link.rel) {
              var rel = link.rel[relIndex];
              if(!thumbnailLink && rel === "thumbnail") {
                thumbnailLink = link.href;                
              }
              if(!iconLink && rel === "icon") {
                iconLink = link.href;                
              }
            }          
          }          
        } 
        if(thumbnailLink) {
          evidence.image = thumbnailLink;
        } else if(iconLink) {
          evidence.image = iconLink;
        }
      });
    };    
  }]);