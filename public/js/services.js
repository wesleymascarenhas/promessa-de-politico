angular
  .module("politiciansPromiseApp")
  .service("userService", ["$http", function($http) {
    this.getAuthenticatedUser = function() {
      return $http.get("/ajax?key=getAuthenticatedUser");
    }
  }])
  .service("politicianService", ["$http", function($http) {
    this.voteInPolitician = function(politician, vote_type) {
      return $http.post("/ajax", {key: "voteInPolitician", params: [politician.id, vote_type]});
    }  
  }])
  .service("oembedService", ["$http", function($http) {
    this.getOEmbed = function(url) {
      return $http.get("/ajax?key=getOEmbed&params[0]=" + url);
    }
  }])
  .service("promiseService", ["$http", function($http) {
    this.getPromises = function(politician, category) {
      return $http.get("/ajax?key=getPromises&params[0]=" + politician.id + "&params[1]=" + category.id);
    }
    this.getAllPromises = function(politician) {
      return $http.get("/ajax?key=getAllPromises&params[0]=" + politician.id);
    }
    this.getMajorPromises = function(politician, page) {
      return $http.get("/ajax?key=getMajorPromises&params[0]=" + politician.id + "&params[1]=" + page);
    }
    this.getOlderPromises = function(politician, page) {
      return $http.get("/ajax?key=getOlderPromises&params[0]=" + politician.id + "&params[1]=" + page);
    }
    this.getLatestPromises = function(politician, page) {
      return $http.get("/ajax?key=getLatestPromises&params[0]=" + politician.id + "&params[1]=" + page);
    }
    this.voteOnPromise = function(promise) {
      return $http.post("/ajax", {key: "voteOnPromise", params: [promise.id]});
    }
    this.editPromise = function(data) {
      return $http.post("/ajax", {key: "editPromise", params: [data]});
    }
    this.registerPromise = function(data) {
      return $http.post("/ajax", {key: "registerPromise", params: [data]});
    }
  }])
  .service("promiseCategoryService", ["$http", function($http) {
    this.getAllCategories = function() {
      return $http.get("/ajax?key=getAllCategories");
    }
  }])
  .service("authenticationService", ["$modal", "$window", "backendData", function($modal, $window, backendData) {
    var thisService = this;
    var user = angular.isDefined(backendData.user) ? backendData.user : null;
    var userAuthenticated = angular.isDefined(backendData.user) ? true : false;
    var modalDefaults = {
      backdrop: "static",
      keyboard: true,
      modalFade: true,
      templateUrl: "/partials/login-modal.html",
      controller: function($scope, $modalInstance) {  
        $scope.modalOptions = {};     
        $scope.modalOptions.close = function(result) {
          $modalInstance.dismiss("cancel");
        };   
        $scope.modalOptions.auth = function(provider) {
          var authWindow = $window.open("/auth/" + provider + "", "", "width = 500, height = 500");
          authWindow.onunload = function () {
            var resultPath = authWindow.location.pathname;
            console.log(resultPath)
            if("/auth-success" === resultPath) {
              userAuthenticated = true;
              $modalInstance.close(thisService.isUserAuthenticated());
            } else if("/auth-fail" === resultPath) {
              userAuthenticated = false;
              $modalInstance.close(thisService.isUserAuthenticated());
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
        $modal.open(modalDefaults).result.then(function(authenticated) {
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
  }]);
