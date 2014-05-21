angular
  .module("politiciansPromiseApp", ["angularMoment", "infinite-scroll", "ui.bootstrap"])
  .config(function($interpolateProvider) {
    $interpolateProvider.startSymbol("<%");
    $interpolateProvider.endSymbol("%>");
  });