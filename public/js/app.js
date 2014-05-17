angular
  .module("politiciansPromiseApp", ["ui-route", "commonComponents", "angularMoment"])
  .config(function($interpolateProvider) {
    $interpolateProvider.startSymbol("<%");
    $interpolateProvider.endSymbol("%>");
  });   