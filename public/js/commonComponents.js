angular
  .module("commonComponents", [])
    .directive("promiseState", function() {
      return {
        scope: {
          for: "@",
          count: "@"
        },
        restrict: "E",
        replace: true,
        template: "<span class='label label-<% getCssClass(for) %>'><% getLabelText(for, count) %></span>",
        link: function($scope, element, attrs) {       
          $scope.getCssClass = function(value) {
            var cssClass = "";
            if (value === "NONE") {
              cssClass = "default";
            } else if(value === "STARTED") {
              cssClass = "warning";              
            } else if(value === "FULFILLED") {
              cssClass = "success";
            } else {
              cssClass = "danger";
            }
            return cssClass;
          };
          $scope.getLabelText = function(forValue, countValue) {
            var labelText = "";
            if (forValue === "NONE") {
              labelText = "Sem informação";
            } else if(forValue === "STARTED") {
              labelText = "Iniciada";              
            } else if(forValue === "FULFILLED") {
              labelText = "Cumprida";
            } else {
              labelText = "Descartada";
            }
            if(countValue) {
              labelText += " (" + countValue + ")";
            }
            return labelText;
          };
        }
      };
    })
    .service("politicianService", ["$http", function($http) {
      this.voteInPolitician = function(politician, vote_type) {
        return $http.post("/ajax", {key: "voteInPolitician", params: [politician.id, vote_type]});
      }  
    }])
    .service("promisesService", ["$http", function($http) {
      this.getPromises = function(politician, category) {
        return $http.get("/ajax?key=getPromises&params[0]=" + politician.id + "&params[1]=" + category.id);
      }
      this.getAllPromises = function(politician) {
        return $http.get("/ajax?key=getAllPromises&params[0]=" + politician.id);
      }
      this.getMajorPromises = function(politician) {
        return $http.get("/ajax?key=getMajorPromises&params[0]=" + politician.id);
      }
      this.getOlderPromises = function(politician) {
        return $http.get("/ajax?key=getOlderPromises&params[0]=" + politician.id);
      }
      this.getLatestPromises = function(politician) {
        return $http.get("/ajax?key=getLatestPromises&params[0]=" + politician.id);
      }
      this.voteOnPromise = function(user, promise) {
        return $http.post("/ajax", {key: "voteOnPromise", params: [promise.id]});
      }
    }]);
