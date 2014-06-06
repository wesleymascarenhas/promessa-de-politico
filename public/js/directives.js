angular
  .module("politiciansPromiseApp")
  .directive("nullIfEmpty", function() {
    return {
      require: "ngModel",
      link: function(scope, element, attrs, ctrl) {
        ctrl.$parsers.push(function(value) {
          return angular.isUndefined(value) || value === "" ? null : value;
        });
      }
    };
  })
  .directive("promiseState", function() {
    return {
      scope: {
        for: "@",
        count: "@"
      },
      restrict: "E",
      replace: true,
      template: "<span class='label label-{{ getCssClass(for) }}'>{{ getLabelText(for, count) }}</span>",
      link: function($scope, element, attrs) {       
        $scope.getCssClass = function(forValue) {
          var cssClass = ""; 
          if(forValue === "NON_STARTED") {
            cssClass = "default";
          } else if(forValue === "STARTED") {
            cssClass = "info";              
          } else if(forValue === "FULFILLED") {
            cssClass = "success";
          } else if(forValue === "PARTIALLY_FULFILLED") {
            cssClass = "warning"
          } else {
            cssClass = "danger";
          }
          return cssClass;
        };
        $scope.getLabelText = function(forValue, countValue) {
          var labelText = "";
          if(forValue === "NON_STARTED") {
            labelText = "Não iniciou";
          } else if(forValue === "STARTED") {
            labelText = "Iniciada";              
          } else if(forValue === "FULFILLED") {
            labelText = "Cumprida";
          } else if (forValue === "PARTIALLY_FULFILLED") {
            labelText = "Cumprida Parcialmente";
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
  });