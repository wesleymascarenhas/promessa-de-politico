angular
  .module("politiciansPromiseApp")
  .service("dataService", [function() {
    this.mergeData = function(source, destiny) {
      for (var attr in source) { 
        destiny[attr] = source[attr]; 
      }
    };
  }])
  .service("alertService", ["$timeout", function($timeout) {
    var alerts = [];
    this.getAlerts = function() {
      return alerts;
    };
    this.addAlert = function(type, message) {
      var that = this;
      var alert = {type: type, msg: message};
      this.getAlerts().push(alert);      
      $timeout(function() {
        that.getAlerts().splice(that.getAlerts().indexOf(alert), 1);
      }, 5000);
    };
  }])
  .service("userService", ["$http", function($http) {
    this.getAuthenticatedUser = function() {
      return $http.post("/ajax", {key: "getAuthenticatedUser"});
    };
    this.sendMessage = function(name, email, message) {
      return $http.post("/ajax", {key: "sendMessage", params: [name, email, message]});
    };
  }])
  .service("politicianService", ["$http", function($http) {
    this.voteInPolitician = function(politician, vote_type) {
      return $http.post("/ajax", {key: "voteInPolitician", params: [politician.id, vote_type]});
    };
    this.updatePolitician = function(politician) {
      return $http.post("/ajax", {key: "updatePolitician", params: [politician]});
    };
    this.registerPolitician = function(politician) {
      return $http.post("/ajax", {key: "registerPolitician", params: [politician]});
    };
    this.findPolitician = function(politician_id, related) {
      return $http.post("/ajax", {key: "findPolitician", params: [politician_id, related]});
    };
    this.getPoliticalAssociations = function() {
      return $http.post("/ajax", {key: "getPoliticalAssociations"});
    };
    this.searchPoliticians = function(value, columns) {
      return $http.post("/ajax", {key: "searchPoliticians", params: [value, columns]});
    };
    this.filterPoliticians = function(page, pageSize, politicalParty, state) {
      return $http.post("/ajax", {key: "filterPoliticians", params: [page, pageSize, politicalParty ? politicalParty.id : null, state ? state.id : null]});
    };
    this.bestPoliticians = function(page, pageSize, politicalParty, state) {
      return $http.post("/ajax", {key: "bestPoliticians", params: [page, pageSize, politicalParty ? politicalParty.id : null, state ? state.id : null]});
    };
    this.worstPoliticians = function(page, pageSize, politicalParty, state) {
      return $http.post("/ajax", {key: "worstPoliticians", params: [page, pageSize, politicalParty ? politicalParty.id : null, state ? state.id : null]});
    };
    this.politiciansWithoutPromises = function(page, pageSize, politicalParty, state) {
      return $http.post("/ajax", {key: "politiciansWithoutPromises", params: [page, pageSize, politicalParty ? politicalParty.id : null, state ? state.id : null]});
    }
  }])
  .service("oembedService", ["$http", function($http) {
    this.getOEmbed = function(url) {
      return $http.post("/ajax", {key: "getOEmbed", params: url});
    };
  }])
  .service("promiseService", ["$http", function($http) {
    this.getPromises = function(politician, category) {
      return $http.post("/ajax", {key: "getPromises", params: [politician.id, category.id]});
    };
    this.getAllPromises = function(politician) {
      return $http.post("/ajax", {key: "getAllPromises", params: [politician.id]});
    };
    this.getMajorPromises = function(politician, page, pageSize) {
      return $http.post("/ajax", {key: "getMajorPromises", params: [politician.id, page, pageSize]});
    };
    this.getOlderPromises = function(politician, page, pageSize) {
      return $http.post("/ajax", {key: "getOlderPromises", params: [politician.id, page, pageSize]});
    };
    this.getLatestPromises = function(politician, page, pageSize) {
      return $http.post("/ajax", {key: "getLatestPromises", params: [politician.id, page, pageSize]});
    };
    this.voteOnPromise = function(promise) {
      return $http.post("/ajax", {key: "voteOnPromise", params: [promise.id]});
    };
    this.editPromise = function(promiseData, evidencesData) {
      return $http.post("/ajax", {key: "editPromise", params: [promiseData, evidencesData]});
    };
    this.registerPromise = function(politician, promiseData, evidencesData) {
      return $http.post("/ajax", {key: "registerPromise", params: [politician.id, promiseData, evidencesData]});
    };
    this.removeEvidence = function(evidence) {
      return $http.post("/ajax", {key: "removeEvidence", params: [evidence]});
    };
    this.commentPromise = function(promise, comment) {
      return $http.post("/ajax", {key: "commentPromise", params: [promise.id, comment]});
    };
    this.removeComment = function(comment) {
      return $http.post("/ajax", {key: "removeComment", params: [comment.id]});
    };
    this.getAllCategories = function() {
      return $http.post("/ajax", {key: "getAllCategories"});
    };
  }]) 
  .service("authenticationService", ["$modal", "$window", "backendData", function($modal, $window, backendData) {
    var $ = this;
    var user = angular.isDefined(backendData.user) ? backendData.user : null;
    var userAuthenticated = angular.isDefined(backendData.user) ? true : false;
    var modalOptions = {
      backdrop: true,
      keyboard: true,
      templateUrl: "/partials/login-modal.html",
      controller: function($scope, $modalInstance) {  
        $scope.modalScope = {};     
        $scope.modalScope.close = function(result) {
          $modalInstance.dismiss("cancel");
        };   
        $scope.modalScope.auth = function(provider) {
          var authWindow = $window.open("/auth/" + provider + "", "", "");
          $window.authResult = function(result) {
            if("success" === result) {
              userAuthenticated = true;
              $modalInstance.close($.isUserAuthenticated());
            } else if("fail" === result) {
              userAuthenticated = false;
              $modalInstance.close($.isUserAuthenticated());
            }
          }
        }; 
      }
    };
    this.getUser = function() {
      return user;
    };
    this.isUserAuthenticated = function() {
      return userAuthenticated;
    };
    this.ensureAuth = function() {
      if(!this.isUserAuthenticated()) {              
        $modal.open(modalOptions).result.then(function(authenticated) {
          if(authenticated === true) {
            $window.location.reload(); 
          } else {
            return false;
          }
        });
      } else {
        return true;
      }
    };
  }])
  .service("modalService", ["$modal", function($modal) {    
    var modalOptions = {
      backdrop: true,
      keyboard: true,
      templateUrl: "/partials/modal.html",      
    };
    var modalScope = {
      headerText: "Deseja realmente proceder ?",
      bodyText: "",
      closeButtonText: 'Cancelar',
      actionButtonText: 'Continuar',
    };  
    this.show = function(customModalOptions, customModalScope) { 
      var extendedOptions = {};
      var extendedScope = {};
      angular.extend(extendedOptions, modalOptions, customModalOptions);
      angular.extend(extendedScope, modalScope, customModalScope);
      extendedOptions.controller = function($scope, $modalInstance) {  
        $scope.modalScope = extendedScope;
        $scope.modalScope.action = function() {
          $modalInstance.close("action");
        };    
        $scope.modalScope.close = function() {
          $modalInstance.dismiss("cancel");
        };        
      };
      return $modal.open(extendedOptions).result;
    };
  }])
